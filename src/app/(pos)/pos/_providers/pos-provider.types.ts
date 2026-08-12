import { ServerError } from "@/core/resources/server-error";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { PriceTierPreviewResult } from "@/features/product/domain/helpers/price-tier-preview";
import { UseListPaymentMethodsState } from "@/features/pos/presentations/hooks/use-list-payment-methods.types";
import { PaymentHandlerStep, PaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/types";

export type CartItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  /**
   * The variant's list price, snapshotted at add-time.
   *
   * Deliberately NOT called `unitPrice`: the server resolves the charged price from the
   * variant's own tier schedule and rejects a submitted one that disagrees, so nothing on
   * the cart may look like a price to send. This is a display input only.
   */
  listPrice: number;
  /** Schedule snapshot at add-time; `null` when the read did not hydrate one. */
  priceTierSchedule: PriceTierScheduleEntity | null;
  qty: number;
};

/** A cart item decorated with its display-only price estimate. */
export type CartLine = CartItem & {
  readonly preview: PriceTierPreviewResult;
};

/**
 * A rejected line from 422 UNIT_PRICE_MISMATCH.
 *
 * Singular, not a map: the contract names exactly one line ever — the lowest-indexed
 * divergent one, never a list. A map would encode a multiplicity the server does not have.
 */
export type PriceMismatchEntry = {
  /** Resolved from the response's zero-based line_index against the submitted cart order. */
  variantId: string | null;
  lineIndex: number;
  /** Raw and unrounded, exactly as returned. */
  submittedUnitPrice: number;
  resolvedUnitPrice: number;
};

/** Re-exported for convenience; the canonical union lives in `_payment-methods/types.ts`. */
export type CheckoutStep = PaymentHandlerStep;

/** Cart state and actions — consumed by cart-leaf components. */
export type PosCartValue = {
  // Cart
  /** Each row carries its display-only price estimate. */
  items: CartLine[];
  /**
   * The cart's estimated total, resolved through the tier schedules.
   *
   * DISPLAY ONLY, and an estimate until a sale is created — the server is authoritative.
   * After a 201, read the amounts off the response instead.
   */
  total: number;
  addItem: (product: ProductForSaleEntity, variant: VariantForSaleEntity) => void;
  updateQty: (productId: string, variantId: string, qty: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;

  /** Set when a sale was rejected with 422 UNIT_PRICE_MISMATCH. Nothing was recorded. */
  priceMismatch: PriceMismatchEntry | null;

  // Submit
  isCheckingOut: boolean;
  checkoutError: ServerError | null;
  completeTransaction: () => Promise<string | null>;

  // Idempotency
  /** Mint a fresh idempotency key. Call before retrying a failed/expired pay-in. */
  regenerateIdempotencyKey: () => void;
};

/** UI/wizard state — consumed by non-cart components. */
export type PosUIValue = {
  // Picker
  search: string;
  setSearch: (value: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  drilldownProduct: ProductForSaleEntity | null;
  enterDrilldown: (product: ProductForSaleEntity) => void;
  exitDrilldown: () => void;

  // Payment methods (whitelist)
  paymentMethodsState: UseListPaymentMethodsState;
  /** Master payment_gateway UUID — what the BE expects in POST /pos/sales. */
  selectedPaymentGatewayId: string | null;
  /** Resolved from selectedPaymentGatewayId. */
  currentMethod: PaymentMethodEntity | null;
  /** Resolved handler for the current method. */
  currentHandler: PaymentMethodHandler | null;

  // Drawer (mobile)
  drawerOpen: boolean;
  toggleDrawer: () => void;

  // Checkout wizard (method-agnostic)
  checkoutStep: CheckoutStep | null;
  startCheckout: () => void;
  cancelCheckout: () => void;
  selectPaymentMethod: (method: PaymentMethodEntity) => void;
  /** Re-open the picker from a later step. Resets the current selection. */
  changePaymentMethod: () => void;
  goToConfirm: () => void;
  /** Generic back navigation; delegates to handler's step list. */
  goBack: () => void;
  /** True when the picker step was bypassed because exactly one method is selectable. */
  pickerAutoSkipped: boolean;
  /** Count of methods that have a registered handler AND don't require scheme selection. */
  selectableMethodCount: number;
};

/**
 * Merged context value — kept for backward compatibility.
 * @deprecated Prefer `usePosCart()` or `usePosUI()` in new components.
 */
export type PosContextValue = PosCartValue & PosUIValue;
