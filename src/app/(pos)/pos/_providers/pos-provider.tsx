"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { previewLinePrice } from "@/features/product/domain/helpers/price-tier-preview";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { useListPaymentMethods } from "@/features/pos/presentations/hooks/use-list-payment-methods";
import { useCreatePosSale } from "@/features/invoice/presentations/hooks/use-create-pos-sale";
import { parseUnitPriceMismatch } from "@/features/invoice/presentations/helpers/unit-price-mismatch";
import { shouldRotateIdempotencyKey } from "@/features/invoice/presentations/helpers/idempotency-rotation";
import { POS_SWR_KEYS } from "@/features/pos/presentations/constants/swr-keys";
import { getPaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/registry";
import { MOCK_PAYMENT_METHODS, USE_MOCK_PAYMENT_METHODS } from "@/app/(pos)/pos/_dev/mock-payment-methods";
import {
  CartItem,
  CartLine,
  CheckoutStep,
  PosCartValue,
  PosContextValue,
  PosUIValue,
  PriceMismatchEntry,
} from "@/app/(pos)/pos/_providers/pos-provider.types";

// ---------------------------------------------------------------------------
// Contexts — value carriers only; all state lives in PosProvider.
// ---------------------------------------------------------------------------

const PosCartContext = createContext<PosCartValue | null>(null);
const PosUIContext = createContext<PosUIValue | null>(null);

/** Narrow hook — cart state and actions. Prefer this in cart-leaf components. */
export function usePosCart(): PosCartValue {
  const ctx = useContext(PosCartContext);
  if (!ctx) throw new Error("usePosCart must be used within a PosProvider");
  return ctx;
}

/** Narrow hook — UI/wizard state. Prefer this in non-cart components. */
export function usePosUI(): PosUIValue {
  const ctx = useContext(PosUIContext);
  if (!ctx) throw new Error("usePosUI must be used within a PosProvider");
  return ctx;
}

/**
 * Merged hook for backward compatibility.
 * @deprecated Prefer `usePosCart()` or `usePosUI()` in new components.
 */
export function usePos(): PosContextValue {
  const cart = usePosCart();
  const ui = usePosUI();
  return useMemo(() => ({ ...cart, ...ui }), [cart, ui]);
}

// ---------------------------------------------------------------------------

const RETRY_DELAY_MS = 1000;

export function PosProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const realPaymentMethodsState = useListPaymentMethods({ isEnabled: true });
  const paymentMethodsState = useMemo(
    () =>
      USE_MOCK_PAYMENT_METHODS
        ? ({ status: "loaded" as const, paymentMethods: MOCK_PAYMENT_METHODS, error: null })
        : realPaymentMethodsState,
    [realPaymentMethodsState],
  );
  const { trigger: createPosSale } = useCreatePosSale();

  // Picker
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [drilldownProduct, setDrilldownProduct] = useState<ProductForSaleEntity | null>(null);

  // Drawer (mobile)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);

  // Cart
  const [items, setItems] = useState<CartItem[]>([]);

  // Payment selection — master payment_gateway UUID, the canonical id used by POST /pos/sales.
  const [selectedPaymentGatewayId, setSelectedPaymentGatewayId] = useState<string | null>(null);

  // Wizard
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep | null>(null);
  const [pickerAutoSkipped, setPickerAutoSkipped] = useState(false);

  // Idempotency
  //
  // A ref, not state: `completeTransaction` rotates the key inside its own catch, and a
  // state update would be invisible to the closure that already captured it. The key is
  // never rendered, so there is nothing to re-render for.
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  useEffect(() => {
    idempotencyKeyRef.current = crypto.randomUUID();
  }, [items, selectedPaymentGatewayId]);

  const regenerateIdempotencyKey = useCallback(() => {
    idempotencyKeyRef.current = crypto.randomUUID();
  }, []);

  // Errors
  const [priceMismatch, setPriceMismatch] = useState<PriceMismatchEntry | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<ServerError | null>(null);

  // Decorate once: one array, one source of truth for every price shown pre-submit.
  const lines = useMemo<CartLine[]>(
    () =>
      items.map((item) => ({
        ...item,
        preview: previewLinePrice({
          basePrice: item.listPrice,
          schedule: item.priceTierSchedule,
          qty: item.qty,
        }),
      })),
    [items],
  );

  // Per-line rounding then summed, matching how the server builds its own summary.
  const total = useMemo(() => lines.reduce((sum, line) => sum + line.preview.estimatedLineAmount, 0), [lines]);

  const currentMethod = useMemo<PaymentMethodEntity | null>(() => {
    if (paymentMethodsState.status !== "loaded") return null;
    if (!selectedPaymentGatewayId) return null;
    return (
      paymentMethodsState.paymentMethods.find((m) => m.paymentGateway.id === selectedPaymentGatewayId) ?? null
    );
  }, [paymentMethodsState, selectedPaymentGatewayId]);

  const currentHandler = useMemo(() => {
    if (!currentMethod) return null;
    return getPaymentMethodHandler(currentMethod.paymentGateway.type);
  }, [currentMethod]);

  const selectableMethods = useMemo(() => {
    if (paymentMethodsState.status !== "loaded") return [];
    return paymentMethodsState.paymentMethods.filter((m) => {
      const handlerExists = getPaymentMethodHandler(m.paymentGateway.type) !== null;
      return handlerExists && !m.paymentGateway.requiresSchemeSelection;
    });
  }, [paymentMethodsState]);

  const enterDrilldown = useCallback((product: ProductForSaleEntity) => {
    setDrilldownProduct(product);
    setSearch("");
  }, []);

  const exitDrilldown = useCallback(() => {
    setDrilldownProduct(null);
    setSearch("");
  }, []);

  // Any cart edit invalidates a pricing rejection: the next submit is a new sale, so a stale
  // UNIT_PRICE_MISMATCH marker must not survive an add/qty-change/remove. (The earlier
  // INSUFFICIENT_STOCK map this also cleared is gone — POST /pos/sales no longer returns it.)
  const clearPriceMismatch = useCallback(() => {
    setPriceMismatch(null);
  }, []);

  const addItem = useCallback(
    (product: ProductForSaleEntity, variant: VariantForSaleEntity) => {
      if (!variant.isAvailable) return;
      clearPriceMismatch();
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.productId === product.id && i.variantId === variant.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        const variantName = variant.name === DEFAULT_VARIANT_NAME ? "" : variant.name;
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            variantName,
            listPrice: variant.price,
            priceTierSchedule: variant.priceTierSchedule,
            qty: 1,
          },
        ];
      });
    },
    [clearPriceMismatch],
  );

  const updateQty = useCallback(
    (productId: string, variantId: string, qty: number) => {
      clearPriceMismatch();
      if (qty <= 0) {
        setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, qty } : i)),
      );
    },
    [clearPriceMismatch],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      clearPriceMismatch();
      setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
    },
    [clearPriceMismatch],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedPaymentGatewayId(null);
    setCheckoutStep(null);
    setCheckoutError(null);
    setPickerAutoSkipped(false);
  }, []);

  // Wizard transitions
  const startCheckout = useCallback(() => {
    if (items.length === 0) return;
    setCheckoutError(null);
    setPickerAutoSkipped(false);
    setCheckoutStep("method");
  }, [items.length]);

  const cancelCheckout = useCallback(() => {
    setCheckoutStep(null);
    setSelectedPaymentGatewayId(null);
    setCheckoutError(null);
    setPickerAutoSkipped(false);
  }, []);

  const changePaymentMethod = useCallback(() => {
    setPickerAutoSkipped(false);
    setCheckoutStep("method");
  }, []);

  const selectPaymentMethod = useCallback((method: PaymentMethodEntity) => {
    if (method.paymentGateway.requiresSchemeSelection) return;

    const handler = getPaymentMethodHandler(method.paymentGateway.type);
    setSelectedPaymentGatewayId(method.paymentGateway.id);
    // If no handler is registered for this method type, advance to "confirm" so
    // the wizard can render the unsupported placeholder.
    setCheckoutStep(handler?.initialStep ?? "confirm");
  }, []);

  const goToConfirm = useCallback(() => {
    setCheckoutStep("confirm");
  }, []);

  const goBack = useCallback(() => {
    if (checkoutStep === null) return;
    if (!currentHandler) {
      // Fallback: from any non-method step without a handler, return to method.
      setCheckoutStep("method");
      return;
    }
    const idx = currentHandler.steps.indexOf(checkoutStep);
    if (idx <= 0) return;
    setCheckoutStep(currentHandler.steps[idx - 1]);
  }, [checkoutStep, currentHandler]);

  // When the user lands on "method" (initial entry or via goBack), reset gateway selection.
  useEffect(() => {
    if (checkoutStep === "method") setSelectedPaymentGatewayId(null);
  }, [checkoutStep]);

  // Auto-skip the picker when only one method is selectable (handler exists,
  // doesn't require scheme selection). Saves an unnecessary tap when Cash is
  // the sole option.
  useEffect(() => {
    if (checkoutStep !== "method") return;
    if (paymentMethodsState.status !== "loaded") return;
    if (selectableMethods.length !== 1) return;
    setPickerAutoSkipped(true);
    selectPaymentMethod(selectableMethods[0]);
  }, [checkoutStep, paymentMethodsState.status, selectableMethods, selectPaymentMethod]);

  // If cart becomes empty mid-wizard, abort the wizard.
  useEffect(() => {
    if (checkoutStep === null) return;
    if (items.length === 0) {
      setCheckoutStep(null);
      setSelectedPaymentGatewayId(null);
      setPickerAutoSkipped(false);
    }
  }, [checkoutStep, items.length]);

  // Entering the wizard closes the mobile full-screen order-review sheet so the
  // checkout panel takes over cleanly.
  useEffect(() => {
    if (checkoutStep !== null) setDrawerOpen(false);
  }, [checkoutStep]);

  const completeTransaction = useCallback(async (): Promise<string | null> => {
    if (isCheckingOut) return null;
    if (items.length === 0) return null;
    if (!selectedPaymentGatewayId) return null;
    if (checkoutStep !== "confirm") return null;

    setCheckoutError(null);
    setIsCheckingOut(true);

    setPriceMismatch(null);

    // The order submitted here is what the server's zero-based `line_index` refers to.
    const submittedVariantIds = items.map((i) => i.variantId);

    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const sale = await createPosSale({
          date: DateTime.now().toUTC().toISO() ?? new Date().toISOString(),
          paymentGatewayId: selectedPaymentGatewayId,
          discount: 0,
          note: undefined,
          // No unitPrice: the server resolves each line from the variant's tier schedule.
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.qty,
            discount: 0,
          })),
          // Read per attempt so a rotation in the catch below is picked up immediately.
          idempotencyKey: idempotencyKeyRef.current,
        });

        // The cashier settles the drawer from the pre-submit estimate, so if the server
        // charged something else they need to know before handing back change. Method
        // -agnostic on purpose: this is the only place holding both numbers.
        const chargedTotal = sale.summary?.total ?? null;
        if (chargedTotal !== null && Math.round(chargedTotal) !== Math.round(total)) {
          showToast(
            {
              title: "Total akhir berbeda dari perkiraan",
              description: "Ikuti nominal pada struk untuk pembayaran dan kembalian.",
              type: "warning",
            },
            "warning",
          );
        }

        // Cash returns status === PAID immediately → auto-clear cart and close wizard.
        // QRIS returns status === READY_TO_SEND (PENDING_PAYMENT on qris.status); the
        // cashier still needs to wait for the customer to scan, so keep cart and step
        // intact. The QRIS handler drives the post-create lifecycle (poll → PAID → clear).
        if (sale.status === OutgoingInvoiceStatus.PAID) {
          setItems([]);
          setSelectedPaymentGatewayId(null);
          setCheckoutStep(null);
          setPickerAutoSkipped(false);
        }
        setIsCheckingOut(false);
        return sale.id;
      } catch (err) {
        const error = err instanceof ServerError ? err : new ServerError(ErrorCodes.UNKNOWN, { error: err });
        const code = error.code;
        const status = typeof error.details?.["status"] === "number" ? (error.details["status"] as number) : null;

        // The one path that legitimately reuses the key: the BE is still processing THIS
        // key, so re-sending the identical body under it is a probe, not a new attempt.
        if (code === ErrorCodes.IDEMPOTENCY_KEY_IN_PROGRESS.code) {
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            continue;
          }
          // Retries exhausted. The original may still land, so KEEP the key — a manual
          // retry must replay idempotently rather than record a second sale.
          showToast({ title: error.message, type: "error" }, "error");
          setCheckoutError(error);
          setIsCheckingOut(false);
          return null;
        }

        // 4xx only — see shouldRotateIdempotencyKey for why a 5xx or network failure
        // must keep the key.
        if (shouldRotateIdempotencyKey(status, code)) {
          idempotencyKeyRef.current = crypto.randomUUID();
        }

        if (code === ErrorCodes.UNIT_PRICE_MISMATCH.code) {
          const parsed = parseUnitPriceMismatch(error, submittedVariantIds);
          if (parsed) setPriceMismatch(parsed);
          showToast(
            {
              title: "Transaksi dibatalkan — harga berubah",
              description: "Tidak ada transaksi yang tercatat. Periksa item yang ditandai lalu ulangi.",
              type: "error",
            },
            "error",
          );
          setCheckoutStep(null);
          setCheckoutError(error);
          setIsCheckingOut(false);
          return null;
        }

        if (code === ErrorCodes.PAYMENT_METHOD_DISABLED.code) {
          showToast({ title: error.message, type: "error" }, "error");
          await revalidateSWRKey(POS_SWR_KEYS.LIST_PAYMENT_METHODS);
          setSelectedPaymentGatewayId(null);
          setPickerAutoSkipped(false);
          setCheckoutStep("method");
          setCheckoutError(error);
          setIsCheckingOut(false);
          return null;
        }

        showToast({ title: error.message, type: "error" }, "error");
        setCheckoutError(error);
        setIsCheckingOut(false);
        return null;
      }
    }

    setIsCheckingOut(false);
    return null;
  }, [
    checkoutStep,
    createPosSale,
    isCheckingOut,
    items,
    selectedPaymentGatewayId,
    showToast,
    total,
  ]);

  // ---------------------------------------------------------------------------
  // Cart context value — stable reference unless cart state changes.
  // ---------------------------------------------------------------------------
  const cartValue = useMemo<PosCartValue>(
    () => ({
      items: lines,
      total,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      priceMismatch,
      isCheckingOut,
      checkoutError,
      completeTransaction,
      regenerateIdempotencyKey,
    }),
    [
      lines,
      total,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      priceMismatch,
      isCheckingOut,
      checkoutError,
      completeTransaction,
      regenerateIdempotencyKey,
    ],
  );

  // ---------------------------------------------------------------------------
  // UI context value — stable reference unless UI/wizard state changes.
  // Notably does NOT include `items` directly, so typing in the search field
  // does NOT invalidate the cart context.
  // ---------------------------------------------------------------------------
  const uiValue = useMemo<PosUIValue>(
    () => ({
      search,
      setSearch,
      selectedCategoryId,
      setSelectedCategoryId,
      drilldownProduct,
      enterDrilldown,
      exitDrilldown,
      paymentMethodsState,
      selectedPaymentGatewayId,
      currentMethod,
      currentHandler,
      drawerOpen,
      toggleDrawer,
      checkoutStep,
      startCheckout,
      cancelCheckout,
      selectPaymentMethod,
      changePaymentMethod,
      goToConfirm,
      goBack,
      pickerAutoSkipped,
      selectableMethodCount: selectableMethods.length,
    }),
    [
      search,
      selectedCategoryId,
      drilldownProduct,
      enterDrilldown,
      exitDrilldown,
      paymentMethodsState,
      selectedPaymentGatewayId,
      currentMethod,
      currentHandler,
      drawerOpen,
      toggleDrawer,
      checkoutStep,
      startCheckout,
      cancelCheckout,
      selectPaymentMethod,
      changePaymentMethod,
      goToConfirm,
      goBack,
      pickerAutoSkipped,
      selectableMethods,
    ],
  );

  return (
    <PosCartContext.Provider value={cartValue}>
      <PosUIContext.Provider value={uiValue}>{children}</PosUIContext.Provider>
    </PosCartContext.Provider>
  );
}
