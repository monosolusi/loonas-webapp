import { cashHandler } from "@/app/(pos)/pos/_payment-methods/cash/cash-handler";
import { qrisHandler } from "@/app/(pos)/pos/_payment-methods/qris/qris-handler";
import { PaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/types";

const HANDLERS: PaymentMethodHandler[] = [cashHandler, qrisHandler];

export function getPaymentMethodHandler(type: string): PaymentMethodHandler | null {
  const lower = (type ?? "").toLowerCase().trim();
  if (!lower) return null;
  return HANDLERS.find((h) => h.type.toLowerCase() === lower) ?? null;
}
