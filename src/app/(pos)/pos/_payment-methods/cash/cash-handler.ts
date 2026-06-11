import { CashConfirmStep } from "@/app/(pos)/pos/_payment-methods/cash/cash-confirm-step";
import { CashNominalStep } from "@/app/(pos)/pos/_payment-methods/cash/cash-nominal-step";
import { CashProvider } from "@/app/(pos)/pos/_payment-methods/cash/cash-context";
import { PaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/types";

export const cashHandler: PaymentMethodHandler = {
  type: "cash",
  steps: ["method", "nominal", "confirm"],
  initialStep: "nominal",
  Provider: CashProvider,
  NominalComponent: CashNominalStep,
  ConfirmComponent: CashConfirmStep,
};
