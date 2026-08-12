"use client";

import clsx from "clsx";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";
import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";
import { CostValuationGapCountCell } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gap-count-cell";
import {
  buildSubjectDisplay,
  classifyCorrectingEntry,
  classifyNullableAmount,
  classifyRow,
} from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_utils/classify-row";
import { formatGapDate } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_utils/format-date";

type CostValuationGapRowProps = {
  row: CostValuationGapRowEntity;
};

export function CostValuationGapRow({ row }: CostValuationGapRowProps) {
  const displayClass = classifyRow(row);
  const subject = buildSubjectDisplay(row);
  const correctingAmount = classifyNullableAmount(row.correctingAmount);
  const currentWac = classifyNullableAmount(row.currentWac);
  const correctingEntry = classifyCorrectingEntry(row);

  const isAction = displayClass === "action";

  return (
    <div
      className={clsx(
        "hidden grid-cols-[2fr_2fr_0.8fr_0.8fr_1fr_1fr_1fr_1.2fr] items-start border-b border-l-4 border-neutral-100 px-6 py-4 last:border-b-0 lg:grid",
        isAction ? "border-l-warning-300 bg-warning-50/30" : "border-l-transparent",
      )}
    >
      {/* Item */}
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-row items-center gap-x-2">
          <span className="text-sm font-medium text-neutral-500">{subject.label}</span>
          {row.deleted && <StatusChip label="Terhapus" variant="neutral" compact />}
        </div>
        {subject.unit && <span className="text-xs text-neutral-300">Satuan: {subject.unit}</span>}
      </div>

      {/* Tindakan */}
      <div className="flex flex-col gap-y-1">
        {isAction ? (
          <span className="text-sm font-medium text-warning-500">{row.actionText}</span>
        ) : (
          <>
            <StatusChip label="Tidak perlu tindakan" variant="neutral" compact />
            <span className="text-sm text-neutral-300">{row.actionText}</span>
          </>
        )}
      </div>

      {/* Qty tidak tercatat */}
      <div className="flex flex-col gap-y-0.5">
        <span className="text-sm tabular-nums text-neutral-500">
          <NumberDisplay value={row.unvaluedQty} />
        </span>
        {row.unit && <span className="text-xs text-neutral-300">{row.unit}</span>}
      </div>

      {/* Kejadian / Penjualan */}
      <div className="flex flex-col gap-y-0.5">
        <span className="text-xs text-neutral-300">Kejadian</span>
        <span className="text-sm tabular-nums text-neutral-500">
          <NumberDisplay value={row.occurrenceCount} />
        </span>
        <span className="text-xs text-neutral-300">Penjualan</span>
        <span className="text-sm tabular-nums text-neutral-500">
          <NumberDisplay value={row.affectedSaleCount} />
        </span>
      </div>

      {/* Periode */}
      <div className="flex flex-col gap-y-0.5">
        <span className="text-sm text-neutral-500">{formatGapDate(row.firstPostingDate)}</span>
        <span className="text-xs text-neutral-300">s/d {formatGapDate(row.lastPostingDate)}</span>
      </div>

      {/* HPP (omitted/understated) */}
      <div className="flex flex-col gap-y-1">
        <CostValuationGapCountCell label="Dilewatkan" count={row.hppOmittedCount} />
        <CostValuationGapCountCell label="Kurang" count={row.hppUnderstatedCount} />
      </div>

      {/* Estimasi koreksi */}
      <div className="flex flex-col gap-y-0.5">
        {correctingAmount.kind === "em-dash" ? (
          <span className="text-sm text-neutral-200">—</span>
        ) : (
          <BalanceDisplay value={correctingAmount.value} />
        )}
        <span className="text-xs text-neutral-300">WAC saat ini</span>
        {currentWac.kind === "em-dash" ? (
          <span className="text-sm text-neutral-200">—</span>
        ) : (
          <span className="text-sm tabular-nums text-neutral-400">
            <NumberDisplay value={currentWac.value} prefix="Rp" />
          </span>
        )}
      </div>

      {/* Akun koreksi */}
      <div className="flex flex-col gap-y-0.5">
        {correctingEntry.kind === "unmapped" ? (
          <span className="text-sm text-neutral-300">Akun belum dipetakan</span>
        ) : (
          <span className="text-sm text-neutral-500">{correctingEntry.label}</span>
        )}
      </div>
    </div>
  );
}