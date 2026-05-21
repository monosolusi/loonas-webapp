"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCash } from "@/app/(pos)/pos/_payment-methods/cash/cash-context";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";
import { CASH_COPY } from "@/app/(pos)/pos/_payment-methods/cash/_copy";

export function CashConfirmStep() {
  const router = useRouter();
  const { total, isCheckingOut, completeTransaction, goBack } = usePos();
  const { tenderedAmount } = useCash();

  const tendered = tenderedAmount ?? total;
  const change = Math.max(0, tendered - total);

  // If cart is edited mid-confirm and total exceeds tendered, bounce back to the previous step.
  useEffect(() => {
    if (tenderedAmount !== null && tenderedAmount < total) goBack();
  }, [tenderedAmount, total, goBack]);

  const onSubmit = async () => {
    const id = await completeTransaction();
    if (id) router.push(`/pos/receipt/${id}`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col gap-y-2 border-b border-b-neutral-100 px-6 py-4 text-sm">
        <div className="flex flex-row items-baseline justify-between">
          <span className="text-neutral-400">{CASH_COPY.TOTAL_LABEL}</span>
          <span className="tabular-nums text-neutral-500">
            <NumberDisplay value={total} suffix="IDR" />
          </span>
        </div>
        <div className="flex flex-row items-baseline justify-between">
          <span className="text-neutral-400">{CASH_COPY.TENDERED_LABEL}</span>
          <span className="tabular-nums text-neutral-500">
            <NumberDisplay value={tendered} suffix="IDR" />
          </span>
        </div>
      </div>

      <div className="flex flex-row items-baseline justify-between px-6 py-6">
        <span className="text-base font-semibold tracking-wide uppercase text-neutral-500">{CASH_COPY.CHANGE_LABEL}</span>
        <span className="text-2xl font-semibold tabular-nums text-success-500">
          <NumberDisplay value={change} suffix="IDR" />
        </span>
      </div>

      <div className="mt-auto px-6 py-4">
        <PrimaryButton label={CASH_COPY.PRIMARY_CTA} loading={isCheckingOut} onClick={onSubmit} />
      </div>
    </div>
  );
}
