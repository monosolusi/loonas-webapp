"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { useListPaymentMethods } from "@/features/pos/presentations/hooks/use-list-payment-methods";
import { useCreatePosSale } from "@/features/pos/presentations/hooks/use-create-pos-sale";
import { POS_SWR_KEYS } from "@/features/pos/presentations/constants/swr-keys";
import { getPaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/registry";
import { MOCK_PAYMENT_METHODS, USE_MOCK_PAYMENT_METHODS } from "@/app/(pos)/pos/_dev/mock-payment-methods";
import {
  CartItem,
  CheckoutStep,
  PosContextValue,
  StockErrorEntry,
} from "@/app/(pos)/pos/_providers/pos-provider.types";

const PosContext = createContext<PosContextValue | null>(null);

export function usePos(): PosContextValue {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos must be used within a PosProvider");
  return ctx;
}

const RETRY_DELAY_MS = 1000;

function resolveAvailableQty(variant: VariantForSaleEntity): number | null {
  if (variant.currentStock !== null) return variant.currentStock;
  if (variant.maxMakeable !== null) return variant.maxMakeable;
  return null;
}

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

  // Cart
  const [items, setItems] = useState<CartItem[]>([]);

  // Payment selection — master payment_gateway UUID, the canonical id used by POST /pos/sales.
  const [selectedPaymentGatewayId, setSelectedPaymentGatewayId] = useState<string | null>(null);

  // Wizard
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep | null>(null);
  const [pickerAutoSkipped, setPickerAutoSkipped] = useState(false);

  // Idempotency
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => crypto.randomUUID());
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, [items, selectedPaymentGatewayId]);

  // Errors
  const [stockErrors, setStockErrors] = useState<Map<string, StockErrorEntry>>(new Map());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<ServerError | null>(null);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0), [items]);

  const hasCartWarnings = useMemo(
    () => items.some((i) => i.availableQtySnapshot !== null && i.qty > i.availableQtySnapshot),
    [items],
  );

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

  const selectableMethods = useMemo<PaymentMethodEntity[]>(() => {
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

  const clearStockErrorFor = useCallback((variantId: string) => {
    setStockErrors((prev) => {
      if (!prev.has(variantId)) return prev;
      const next = new Map(prev);
      next.delete(variantId);
      return next;
    });
  }, []);

  const addItem = useCallback(
    (product: ProductForSaleEntity, variant: VariantForSaleEntity) => {
      if (!variant.isAvailable) return;
      clearStockErrorFor(variant.id);
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
            unitPrice: variant.price,
            qty: 1,
            availableQtySnapshot: resolveAvailableQty(variant),
          },
        ];
      });
    },
    [clearStockErrorFor],
  );

  const updateQty = useCallback(
    (productId: string, variantId: string, qty: number) => {
      clearStockErrorFor(variantId);
      if (qty <= 0) {
        setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, qty } : i)),
      );
    },
    [clearStockErrorFor],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      clearStockErrorFor(variantId);
      setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
    },
    [clearStockErrorFor],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedPaymentGatewayId(null);
    setCheckoutStep(null);
    setStockErrors(new Map());
    setCheckoutError(null);
    setPickerAutoSkipped(false);
  }, []);

  // Wizard transitions
  const startCheckout = useCallback(() => {
    if (items.length === 0) return;
    setCheckoutError(null);
    setStockErrors(new Map());
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

  const handleStockErrorDetails = useCallback(
    (details: Record<string, any>) => {
      const rawItems = details["items"];
      if (!Array.isArray(rawItems)) return;

      const variantMap = new Map<string, StockErrorEntry>();
      const rawMaterialNames: string[] = [];
      for (const entry of rawItems) {
        const kind = entry["kind"];
        if (kind === "variant") {
          const variantId = entry["variant_id"];
          if (typeof variantId !== "string") continue;
          variantMap.set(variantId, {
            available: Number(entry["available"] ?? 0),
            requested: Number(entry["requested"] ?? 0),
            variantName: String(entry["variant_name"] ?? ""),
          });
        } else if (kind === "raw_material") {
          const name = entry["raw_material_name"] ?? entry["raw_material_id"];
          if (typeof name === "string") rawMaterialNames.push(name);
        }
      }

      setStockErrors(variantMap);
      if (rawMaterialNames.length > 0) {
        showToast(
          {
            title: "Bahan baku kurang",
            description: rawMaterialNames.join(", "),
            type: "warning",
          },
          "warning",
        );
      }
    },
    [showToast],
  );

  const completeTransaction = useCallback(async (): Promise<string | null> => {
    if (isCheckingOut) return null;
    if (items.length === 0) return null;
    if (!selectedPaymentGatewayId) return null;
    if (checkoutStep !== "confirm") return null;

    setCheckoutError(null);
    setIsCheckingOut(true);

    const currentKey = idempotencyKey;
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
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.qty,
            unitPrice: i.unitPrice,
            discount: 0,
          })),
          idempotencyKey: currentKey,
        });

        // Cash returns status === PAID immediately → auto-clear cart and close wizard.
        // QRIS returns status === READY_TO_SEND (PENDING_PAYMENT on qris.status); the
        // cashier still needs to wait for the customer to scan, so keep cart and step
        // intact. The QRIS handler drives the post-create lifecycle (poll → PAID → clear).
        if (sale.status === OutgoingInvoiceStatus.PAID) {
          setItems([]);
          setSelectedPaymentGatewayId(null);
          setCheckoutStep(null);
          setStockErrors(new Map());
          setPickerAutoSkipped(false);
        }
        setIsCheckingOut(false);
        return sale.id;
      } catch (err) {
        const error = err instanceof ServerError ? err : new ServerError(ErrorCodes.UNKNOWN, { error: err });
        const code = error.code;

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

        if (code === ErrorCodes.INSUFFICIENT_STOCK.code) {
          handleStockErrorDetails(error.details ?? {});
          showToast({ title: error.message, type: "error" }, "error");
          setCheckoutStep(null);
          setCheckoutError(error);
          setIsCheckingOut(false);
          return null;
        }

        // BE caches all responses (incl. 4xx/5xx) under the Idempotency-Key. A retry
        // with the same key returns the cached failure, so don't auto-retry CONFLICT —
        // the cart-mutation effect regenerates the key for any genuine retry.
        if (code === ErrorCodes.IDEMPOTENCY_KEY_IN_PROGRESS.code && attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          continue;
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
    handleStockErrorDetails,
    idempotencyKey,
    isCheckingOut,
    items,
    selectedPaymentGatewayId,
    showToast,
  ]);

  const value = useMemo<PosContextValue>(
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
      items,
      total,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      hasCartWarnings,
      stockErrors,
      checkoutStep,
      startCheckout,
      cancelCheckout,
      selectPaymentMethod,
      changePaymentMethod,
      goToConfirm,
      goBack,
      pickerAutoSkipped,
      selectableMethodCount: selectableMethods.length,
      isCheckingOut,
      checkoutError,
      completeTransaction,
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
      items,
      total,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      hasCartWarnings,
      stockErrors,
      checkoutStep,
      startCheckout,
      cancelCheckout,
      selectPaymentMethod,
      changePaymentMethod,
      goToConfirm,
      goBack,
      pickerAutoSkipped,
      selectableMethods,
      isCheckingOut,
      checkoutError,
      completeTransaction,
    ],
  );

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}
