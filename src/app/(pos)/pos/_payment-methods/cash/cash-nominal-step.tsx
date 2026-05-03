"use client";

import clsx from "clsx";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCash } from "@/app/(pos)/pos/_payment-methods/cash/cash-context";
import { CashQuickAmountChips } from "@/app/(pos)/pos/_payment-methods/cash/cash-quick-amount-chips";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function CashNominalStep() {
  const { total, goToConfirm } = usePos();
  const { tenderedAmount, setTenderedAmount } = useCash();

  const isShortfall = tenderedAmount !== null && tenderedAmount < total;
  const canContinue = tenderedAmount !== null && tenderedAmount >= total;
  const change = tenderedAmount !== null ? tenderedAmount - total : null;
  const shortfallAmount = isShortfall && tenderedAmount !== null ? total - tenderedAmount : 0;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-row items-baseline justify-between border-b border-b-neutral-100 px-4 py-4 text-sm">
        <span className="text-neutral-400">Total</span>
        <span className="font-semibold tabular-nums text-neutral-500">
          <NumberDisplay value={total} suffix="IDR" />
        </span>
      </div>

      <div className="flex flex-col gap-y-3 px-4 py-4">
        <CurrencyInput
          label="Diterima"
          value={tenderedAmount ?? undefined}
          onChange={(v) => setTenderedAmount(v === 0 ? null : v)}
        />
        <CashQuickAmountChips total={total} selectedAmount={tenderedAmount} onSelect={setTenderedAmount} />
      </div>

      <div className="flex flex-row items-baseline justify-between border-t border-t-neutral-100 px-4 py-4 text-sm">
        <span className="text-neutral-400">Kembalian</span>
        <span
          className={clsx(
            "font-semibold tabular-nums",
            isShortfall ? "text-warning-300" : "text-neutral-500",
          )}
        >
          {isShortfall ? (
            <>
              ⚠ Kurang <NumberDisplay value={shortfallAmount} suffix="IDR" />
            </>
          ) : change !== null ? (
            <NumberDisplay value={change} suffix="IDR" />
          ) : (
            "—"
          )}
        </span>
      </div>

      <div className="mt-auto px-4 py-4">
        <PrimaryButton label="Lanjutkan" disabled={!canContinue} onClick={goToConfirm} />
      </div>
    </div>
  );
}
