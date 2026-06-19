"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { JournalLineBalance } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";

type JournalLineTotalsFooterProps = {
  balance: JournalLineBalance;
};

export function JournalLineTotalsFooter({ balance }: JournalLineTotalsFooterProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const balanceIndicator = (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
        balance.isBalanced ? "text-success-400" : "text-neutral-300",
      )}
    >
      {balance.isBalanced ? (
        <>
          <CheckCircleIcon className="size-4 shrink-0" aria-hidden="true" />
          <span>Seimbang</span>
        </>
      ) : (
        <>
          <ExclamationCircleIcon className="size-4 shrink-0" aria-hidden="true" />
          <span>Belum seimbang — total Debit harus sama dengan total Kredit</span>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        {balanceIndicator}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-300">Total Debit</span>
            <span className="text-sm font-semibold text-neutral-400">
              <NumberDisplay value={balance.totalDebit} prefix="Rp" />
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-300">Total Kredit</span>
            <span className="text-sm font-semibold text-neutral-400">
              <NumberDisplay value={balance.totalCredit} prefix="Rp" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3">
      {balanceIndicator}
      <div className="text-right text-sm font-semibold text-neutral-400">
        <NumberDisplay value={balance.totalDebit} prefix="Rp" />
      </div>
      <div className="text-right text-sm font-semibold text-neutral-400">
        <NumberDisplay value={balance.totalCredit} prefix="Rp" />
      </div>
      {/* Spacer to align with the remove button column */}
      <div className="size-8" aria-hidden="true" />
    </div>
  );
}
