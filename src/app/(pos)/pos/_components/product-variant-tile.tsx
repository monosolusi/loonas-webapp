"use client";

import clsx from "clsx";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { StockHint } from "@/app/(pos)/pos/_components/stock-hint";
import { UnavailableBadge } from "@/app/(pos)/pos/_components/unavailable-badge";
import { OutOfStockBadge } from "@/app/(pos)/pos/_components/out-of-stock-badge";
import { VariantTierSummary } from "@/app/(pos)/pos/_components/variant-tier-summary";

type ProductVariantTileProps = {
  variant: VariantForSaleEntity;
  qtyInCart: number;
  onClick: () => void;
};

/** A variant tile shown in the mobile drill-down grid after tapping a multi-variant product. */
export function ProductVariantTile({ variant, qtyInCart, onClick }: ProductVariantTileProps) {
  const unavailable = !variant.isAvailable;

  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={onClick}
      className={clsx(
        "relative flex min-h-[4.5rem] flex-col justify-between gap-y-1 rounded-xl border border-neutral-200 bg-white p-3 text-left transition-colors",
        unavailable ? "opacity-60" : "active:bg-primary-50",
      )}
    >
      <div className="flex flex-row items-start gap-x-1.5">
        <span className="line-clamp-2 flex-1 text-sm leading-5 text-neutral-500">{variant.name}</span>
        {/* StatusChip renders a span; Chip renders a button and would nest inside this tile. */}
        {variant.priceTierSchedule?.hasTiers && <StatusChip label="Grosir" variant="primary" compact />}
        {/* Safe to render unconditionally — returns null unless stock_status is OUT_OF_STOCK. */}
        <OutOfStockBadge status={variant.stockStatus} />
      </div>
      {unavailable ? (
        variant.unavailableReason ? <UnavailableBadge reason={variant.unavailableReason} /> : null
      ) : (
        <div className="flex flex-col gap-y-0.5">
          <VariantTierSummary schedule={variant.priceTierSchedule} />
          <div className="flex flex-row items-end justify-between gap-x-1">
            <span className="text-sm font-semibold tabular-nums text-neutral-500">
              Rp <NumberDisplay value={variant.price} />
            </span>
            <StockHint available={variant.currentStock ?? variant.maxMakeable} />
          </div>
        </div>
      )}
      {qtyInCart > 0 && (
        <span className="absolute top-2 right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-300 px-1.5 text-xs font-semibold tabular-nums text-white">
          {qtyInCart}
        </span>
      )}
    </button>
  );
}
