import { ServerError } from "@/core/resources/server-error";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { UseListPaymentMethodsState } from "@/features/pos/presentations/hooks/use-list-payment-methods.types";
import { PaymentHandlerStep, PaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/types";

export type CartItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  qty: number;
  /** Snapshot of available qty at add-time; null = unbounded (service). Used for cart-side warning. */
  availableQtySnapshot: number | null;
};

export type StockErrorEntry = {
  available: number;
  requested: number;
  variantName: string;
};

/** Re-exported for convenience; the canonical union lives in `_payment-methods/types.ts`. */
export type CheckoutStep = PaymentHandlerStep;

export type PosContextValue = {
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

  // Cart
  items: CartItem[];
  total: number;
  addItem: (product: ProductForSaleEntity, variant: VariantForSaleEntity) => void;
  updateQty: (productId: string, variantId: string, qty: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  /** True when any cart row's qty exceeds its availableQtySnapshot. Disables Bayar. */
  hasCartWarnings: boolean;

  // Stock errors (from BE INSUFFICIENT_STOCK response)
  stockErrors: Map<string, StockErrorEntry>;

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

  // Submit
  isCheckingOut: boolean;
  checkoutError: ServerError | null;
  completeTransaction: () => Promise<string | null>;

  // Idempotency
  /** Mint a fresh idempotency key. Call before retrying a failed/expired pay-in. */
  regenerateIdempotencyKey: () => void;
};
