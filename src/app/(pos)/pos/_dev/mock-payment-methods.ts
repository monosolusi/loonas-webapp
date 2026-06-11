import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PricingEntity } from "@/features/payment/domain/entities/pricing";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";

// Dev-only design preview. Toggled via NEXT_PUBLIC_DEV_MOCK_PAYMENT_METHODS in
// .env (default: false). When true, the POS provider replaces the real BE
// payment-methods list with the seed below so designers can preview the
// multi-method tile grid + selected-method strip.
//
// Side effect when ON: the picker step is NOT auto-skipped (since the seed
// has multiple selectable methods).
export const USE_MOCK_PAYMENT_METHODS = process.env.NEXT_PUBLIC_DEV_MOCK_PAYMENT_METHODS === "true";

export const MOCK_PAYMENT_METHODS: PaymentMethodEntity[] = [
  new PaymentMethodEntity({
    id: "mock-cash",
    isEnabled: true,
    sortOrder: 1,
    createdAt: "",
    updatedAt: "",
    paymentGateway: new PaymentGatewayEntity({
      id: "mock-gw-cash",
      title: "Tunai",
      description: "Bayar dengan kas — kembalian dihitung otomatis",
      isActive: true,
      requiresSchemeSelection: false,
      pricing: new PricingEntity(0, 0),
      schemes: [],
      type: "cash",
    }),
  }),
  new PaymentMethodEntity({
    id: "mock-qris",
    isEnabled: true,
    sortOrder: 2,
    createdAt: "",
    updatedAt: "",
    paymentGateway: new PaymentGatewayEntity({
      id: "mock-gw-qris",
      title: "QRIS",
      description: "Pindai QR di aplikasi pembayaran",
      isActive: true,
      requiresSchemeSelection: false,
      pricing: new PricingEntity(0, 0.7),
      schemes: [],
      type: "qris",
    }),
  }),
  new PaymentMethodEntity({
    id: "mock-card",
    isEnabled: true,
    sortOrder: 3,
    createdAt: "",
    updatedAt: "",
    paymentGateway: new PaymentGatewayEntity({
      id: "mock-gw-card",
      title: "Kartu Kredit / Debit",
      description: "Visa, Mastercard, JCB",
      isActive: true,
      requiresSchemeSelection: true,
      pricing: new PricingEntity(0, 2.5),
      schemes: [],
      type: "credit_card",
    }),
  }),
  new PaymentMethodEntity({
    id: "mock-voucher",
    isEnabled: true,
    sortOrder: 4,
    createdAt: "",
    updatedAt: "",
    paymentGateway: new PaymentGatewayEntity({
      id: "mock-gw-voucher",
      title: "Voucher",
      description: "Tukar dengan kode voucher",
      isActive: true,
      requiresSchemeSelection: false,
      pricing: new PricingEntity(0, 0),
      schemes: [],
      type: "voucher",
    }),
  }),
];
