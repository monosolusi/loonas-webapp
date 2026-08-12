"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierModeLabel } from "@/features/product/domain/enums/tier-mode";
import { formatMinQty } from "@/features/product/presentations/helpers/price-tier-form";

/** How many brackets fit on one line before the row starts to crowd. */
const VISIBLE_TIERS = 2;

type VariantTierSummaryProps = {
  /** `null` means the read did not hydrate a schedule — renders nothing. */
  schedule: PriceTierScheduleEntity | null;
};

export function VariantTierSummary({ schedule }: VariantTierSummaryProps) {
  if (!schedule || !schedule.hasTiers) return null;

  const shown = schedule.tiers.slice(0, VISIBLE_TIERS);
  const remaining = schedule.tiers.length - shown.length;

  return (
    <span className="truncate text-[11px] leading-4 tabular-nums text-neutral-300">
      {TierModeLabel[schedule.tierMode]}
      {shown.map((tier) => (
        <span key={`${tier.minQty}-${tier.unitPrice}`}>
          {" · ≥"}
          {formatMinQty(tier.minQty)} <NumberDisplay value={tier.unitPrice} />
        </span>
      ))}
      {remaining > 0 && ` · +${remaining} lagi`}
    </span>
  );
}
