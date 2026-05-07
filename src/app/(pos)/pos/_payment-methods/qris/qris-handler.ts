import { QrisConfirmStep } from "@/app/(pos)/pos/_payment-methods/qris/qris-confirm-step";
import { PaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/types";

export const qrisHandler: PaymentMethodHandler = {
  type: "qris",
  steps: ["method", "confirm"],
  initialStep: "confirm",
  ConfirmComponent: QrisConfirmStep,
};
