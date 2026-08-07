"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { classifyCount } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_utils/classify-row";

type CostValuationGapCountCellProps = {
  label: string;
  count: number | null;
};

export function CostValuationGapCountCell({ label, count }: CostValuationGapCountCellProps) {
  const classified = classifyCount(count);
  return (
    <div className="flex flex-col gap-y-0.5">
      <span className="text-xs text-neutral-300">{label}</span>
      {classified.kind === "unclassified" ? (
        <span className="text-sm text-neutral-200">Belum diklasifikasi</span>
      ) : (
        <span className="text-sm tabular-nums text-neutral-500">
          <NumberDisplay value={classified.value} />
        </span>
      )}
    </div>
  );
}