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
      <div className="flex flex-col items-center px-6 pt-8 pb-2">
        <div className="border-y border-neutral-100 px-10 py-4 text-center">
          <div className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Total yang dibayar</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-500">
            <NumberDisplay value={total} suffix="IDR" />
          </div>
        </div>
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
