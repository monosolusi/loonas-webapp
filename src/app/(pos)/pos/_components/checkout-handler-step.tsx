"use client";

import { Fragment } from "react";
import { PaymentHandlerStep, PaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/types";

type CheckoutHandlerStepProps = {
  handler: PaymentMethodHandler;
  step: PaymentHandlerStep;
};

export function CheckoutHandlerStep({ handler, step }: CheckoutHandlerStepProps) {
  const Wrapper = handler.Provider ?? Fragment;
  const NominalComponent = handler.NominalComponent;
  const ConfirmComponent = handler.ConfirmComponent;

  return (
    <Wrapper>
      {step === "nominal" && NominalComponent ? <NominalComponent /> : null}
      {step === "confirm" ? <ConfirmComponent /> : null}
    </Wrapper>
  );
}
