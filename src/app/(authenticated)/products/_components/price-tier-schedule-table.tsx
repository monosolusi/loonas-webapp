"use client";

import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierModeLabel } from "@/features/product/domain/enums/tier-mode";
import { formatMinQty } from "@/features/product/presentations/helpers/price-tier-form";

type PriceTierScheduleTableProps = {
  /**
   * Non-nullable on purpose. A `null` schedule means "this endpoint did not hydrate one",
   * which must render nothing at all — so callers are forced to narrow before they can
   * mount this component, and the not-hydrated branch cannot be forgotten.
   */
  schedule: PriceTierScheduleEntity;
};

export function PriceTierScheduleTable({ schedule }: PriceTierScheduleTableProps) {
  if (!schedule.hasTiers) {
    return <p className="py-3 text-sm text-neutral-300">Harga tunggal, tanpa harga grosir.</p>;
  }

  return (
    <div className="flex flex-col gap-y-2 py-1">
      <span className="text-xs text-neutral-300">{TierModeLabel[schedule.tierMode]}</span>
      <div className="flex flex-col">
        {schedule.tiers.map((tier) => (
          <div
            key={`${tier.minQty}-${tier.unitPrice}`}
            className="flex flex-row items-baseline justify-between gap-x-3 border-b border-b-neutral-100 py-2 text-sm last:border-b-0"
          >
            <span className="text-neutral-400">Mulai {formatMinQty(tier.minQty)}</span>
            <span className="font-medium tabular-nums text-neutral-500">
              <CurrencyDisplay value={tier.unitPrice} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
