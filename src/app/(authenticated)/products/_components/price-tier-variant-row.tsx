"use client";

import Image from "next/image";
import clsx from "clsx";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { PriceTierSummary } from "@/app/(authenticated)/products/_components/price-tier-summary";
import { PriceTierScheduleTable } from "@/app/(authenticated)/products/_components/price-tier-schedule-table";

type PriceTierVariantRowProps = {
  variantName: string;
  basePrice: number;
  /** Non-nullable — an unhydrated variant is filtered out before this row is rendered. */
  schedule: PriceTierScheduleEntity;
  expanded: boolean;
  isLast?: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
};

export function PriceTierVariantRow({
  variantName,
  basePrice,
  schedule,
  expanded,
  isLast,
  onToggleExpand,
  onEdit,
}: PriceTierVariantRowProps) {
  return (
    <div className={clsx(!isLast && "border-b border-neutral-100")}>
      <div className="flex flex-row items-center gap-x-3 px-4 py-3">
        <button type="button" onClick={onToggleExpand} className="shrink-0 text-neutral-300" aria-label="Lihat tingkat">
          <ChevronRightIcon className={clsx("size-4 transition-transform", expanded && "rotate-90")} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-y-0.5">
          <span className="truncate text-sm font-medium text-neutral-500">{variantName}</span>
          <PriceTierSummary schedule={schedule} />
        </div>
        <span className="shrink-0 text-sm tabular-nums text-neutral-400">
          <CurrencyDisplay value={basePrice} />
        </span>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Atur harga grosir"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
        >
          <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="" width={16} height={16} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-neutral-50 bg-neutral-50/50 px-11 py-2">
          <PriceTierScheduleTable schedule={schedule} />
        </div>
      )}
    </div>
  );
}
