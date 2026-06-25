"use client";

import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { usePphFinal } from "@/app/(authenticated)/finance/pph-final/_providers/pph-final-provider";

export function PphFinalPreviewCard() {
  const { amount, cashAccount, journalDate } = usePphFinal();

  const isVisible = amount > 0 && !!cashAccount;

  return (
    <SectionCard title="Apa yang akan kami catat">
      <div
        aria-live="polite"
        className={clsx(
          "transition-all duration-[180ms]",
          isVisible
            ? "translate-y-0 opacity-100 motion-reduce:translate-y-0"
            : "pointer-events-none translate-y-1 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-0",
        )}
      >
        {isVisible && (
          <div className="flex flex-col gap-y-3">
            {/* Debit row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Debit</span>
              <div className="flex flex-1 items-center justify-between px-4">
                <span className="text-sm text-neutral-500">Beban PPh Final UMKM</span>
                <span className="text-sm font-medium text-neutral-500">{IDRFormatter.toCurrency(amount)}</span>
              </div>
            </div>

            {/* Credit row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Kredit</span>
              <div className="flex flex-1 items-center justify-between px-4">
                <span className="text-sm text-neutral-500">{cashAccount.name}</span>
                <span className="text-sm font-medium text-neutral-500">{IDRFormatter.toCurrency(amount)}</span>
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Date line */}
            <p className="text-sm text-neutral-300">
              Tanggal jurnal:{" "}
              <span className="text-neutral-500">
                {journalDate.setLocale("id").toFormat("d MMMM yyyy")}
              </span>
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
