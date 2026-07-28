"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierModeLabel } from "@/features/product/domain/enums/tier-mode";

type PriceTierSummaryProps = {
  /** Non-nullable — see PriceTierScheduleTable. */
  schedule: PriceTierScheduleEntity;
};

export function PriceTierSummary({ schedule }: PriceTierSummaryProps) {
  if (!schedule.hasTiers) {
    return <span className="text-xs text-neutral-300">Harga tunggal</span>;
  }

  return (
    <div className="flex flex-row items-center gap-x-2">
      <StatusChip label="Grosir" variant="primary" compact />
      <span className="text-xs text-neutral-300">
        {schedule.tierCount} tingkat · {TierModeLabel[schedule.tierMode]}
      </span>
    </div>
  );
}
