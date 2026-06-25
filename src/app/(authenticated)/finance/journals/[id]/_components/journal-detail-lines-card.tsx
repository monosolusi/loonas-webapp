"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useJournalDetail } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";

export function JournalDetailLinesCard() {
  const { journal } = useJournalDetail();

  const isBalanced = journal.totalDebit === journal.totalCredit;

  return (
    <SectionCard title="Baris Jurnal">
      <div className="flex flex-col gap-y-0">
        {/* Header row */}
        <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] gap-x-4 border-b border-neutral-100 pb-2">
          <span className="text-xs font-medium text-neutral-300">KODE</span>
          <span className="text-xs font-medium text-neutral-300">NAMA AKUN</span>
          <span className="text-right text-xs font-medium text-neutral-300">DEBIT</span>
          <span className="text-right text-xs font-medium text-neutral-300">KREDIT</span>
        </div>

        {/* Line rows */}
        {journal.lines.map((line) => (
          <div key={line.id} className="grid grid-cols-[1.5fr_3fr_1fr_1fr] gap-x-4 border-b border-neutral-50 py-3">
            <span className="font-mono text-sm text-neutral-400">{line.accountCode}</span>
            <span className="text-sm text-neutral-500">{line.accountName}</span>
            <span className="text-right text-sm text-neutral-500">{line.displayDebit}</span>
            <span className="text-right text-sm text-neutral-500">{line.displayCredit}</span>
          </div>
        ))}

        {/* Footer totals */}
        <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] gap-x-4 pt-3">
          <div className="col-span-2 flex flex-row items-center gap-x-2">
            <span className="text-sm font-semibold text-neutral-500">Total</span>
            {isBalanced && <StatusChip label="Seimbang" variant="success" compact />}
          </div>
          <span className="text-right text-sm font-semibold text-neutral-500">
            {IDRFormatter.toCurrency(journal.totalDebit)}
          </span>
          <span className="text-right text-sm font-semibold text-neutral-500">
            {IDRFormatter.toCurrency(journal.totalCredit)}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
