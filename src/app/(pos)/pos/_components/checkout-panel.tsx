"use client";

import { CheckoutHeader } from "@/app/(pos)/pos/_components/checkout-header";
import { CheckoutStepMethod } from "@/app/(pos)/pos/_components/checkout-step-method";
import { CheckoutHandlerStep } from "@/app/(pos)/pos/_components/checkout-handler-step";
import { CheckoutStepUnsupported } from "@/app/(pos)/pos/_components/checkout-step-unsupported";
import { CheckoutSelectedMethodStrip } from "@/app/(pos)/pos/_components/checkout-selected-method-strip";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function CheckoutPanel() {
  const { checkoutStep, currentHandler } = usePos();

  return (
    <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white">
      <CheckoutHeader />
      <CheckoutSelectedMethodStrip />
      {checkoutStep === "method" && <CheckoutStepMethod />}
      {(checkoutStep === "nominal" || checkoutStep === "confirm") &&
        (currentHandler === null ? (
          <CheckoutStepUnsupported />
        ) : (
          <CheckoutHandlerStep handler={currentHandler} step={checkoutStep} />
        ))}
    </div>
  );
}
