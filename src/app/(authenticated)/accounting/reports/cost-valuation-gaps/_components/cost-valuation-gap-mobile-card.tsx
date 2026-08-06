"use client";

import { DateTime } from "luxon";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";
import {
  buildSubjectDisplay,
  classifyCorrectingEntry,
  classifyNullableAmount,
  classifyRow,
} from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_utils/classify-row";

type CostValuationGapMobileCardProps = {
  row: CostValuationGapRowEntity;
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  return DateTime.fromISO(iso).toFormat("d MMM yyyy", { locale: "id" });
}

export function CostValuationGapMobileCard({ row }: CostValuationGapMobileCardProps) {
  const displayClass = classifyRow(row);
  const subject = buildSubjectDisplay(row);
  const correctingAmount = classifyNullableAmount(row.correctingAmount);
  const correctingEntry = classifyCorrectingEntry(row);
  const isAction = displayClass === "action";

  return (
    <MobileListCard
      title={
        <span className="flex flex-row items-center gap-x-2">
          {subject.label}
          {row.deleted && <StatusChip label="Terhapus" variant="neutral" compact />}
        </span>
      }
      subtitle={
        isAction ? (
          <span className="text-warning-500">{row.actionText}</span>
        ) : (
          <span>
            <StatusChip label="Tidak perlu tindakan" variant="neutral" compact />
            <span className="ml-1">{row.actionText}</span>
          </span>
        )
      }
      meta={
        <span>
          {formatDate(row.firstPostingDate)} — {formatDate(row.lastPostingDate)} ·{" "}
          <NumberDisplay value={row.unvaluedQty} />
          {row.unit ? ` ${row.unit}` : ""} tidak tercatat
        </span>
      }
      trailingTop={
        correctingAmount.kind === "em-dash" ? (
          <span className="text-neutral-200">—</span>
        ) : (
          <span className="tabular-nums">
            <NumberDisplay value={correctingAmount.value} prefix="Rp" />
          </span>
        )
      }
      trailingBottom={
        correctingEntry.kind === "unmapped" ? (
          <span className="text-xs text-neutral-300">Akun belum dipetakan</span>
        ) : (
          <span className="text-xs text-neutral-400">{correctingEntry.label}</span>
        )
      }
      chevron={false}
    />
  );
}