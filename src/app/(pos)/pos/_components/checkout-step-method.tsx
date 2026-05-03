"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { CheckoutStepMethodBodyError } from "@/app/(pos)/pos/_components/checkout-step-method-body-error";
import { CheckoutStepMethodBodyList } from "@/app/(pos)/pos/_components/checkout-step-method-body-list";
import { CheckoutStepMethodBodyLoading } from "@/app/(pos)/pos/_components/checkout-step-method-body-loading";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function CheckoutStepMethod() {
  const { paymentMethodsState, total, selectPaymentMethod } = usePos();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-row items-baseline justify-between border-b border-b-neutral-100 px-4 py-4 text-sm">
        <span className="text-neutral-400">Total yang dibayar</span>
        <span className="font-semibold tabular-nums text-neutral-500">
          <NumberDisplay value={total} suffix="IDR" />
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        {paymentMethodsState.status === "loading" && <CheckoutStepMethodBodyLoading />}
        {paymentMethodsState.status === "error" && <CheckoutStepMethodBodyError error={paymentMethodsState.error} />}
        {paymentMethodsState.status === "loaded" && (
          <CheckoutStepMethodBodyList methods={paymentMethodsState.paymentMethods} onSelect={selectPaymentMethod} />
        )}
      </div>
    </div>
  );
}
