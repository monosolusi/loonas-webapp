"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { NumberDisplay } from "@/core/presentations/components/number-display";

type DashboardLowStockRowProps = {
  stockItem: StockItemEntity;
};

function resolveHref(stockItem: StockItemEntity): string {
  if (stockItem.type === StockItemType.RAW_MATERIAL && stockItem.rawMaterial !== null) {
    return `/settings/raw-materials/${stockItem.rawMaterial.id}`;
  }
  return "/products";
}

export function DashboardLowStockRow({ stockItem }: DashboardLowStockRowProps) {
  const router = useRouter();
  const href = resolveHref(stockItem);
  const unit = stockItem.rawMaterial?.unit ?? null;

  return (
    <div
      onClick={() => router.push(href)}
      className={clsx(
        "flex cursor-pointer items-center gap-3 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0",
        "hover:border-l-primary-300 hover:bg-primary-50",
        "transition-colors duration-150",
      )}
    >
      <ExclamationTriangleIcon className="size-5 shrink-0 text-warning-500" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{stockItem.itemName}</span>
        {stockItem.variantName && (
          <span className="truncate text-xs leading-4 text-neutral-300">{stockItem.variantName}</span>
        )}
      </div>
      <div className="shrink-0 text-right">
        <span className="text-sm leading-5 font-semibold text-neutral-500">
          <NumberDisplay value={stockItem.currentStock} suffix={unit ?? undefined} />
        </span>
        {stockItem.minStock !== null && (
          <div className="text-xs leading-4 text-neutral-300">
            min <NumberDisplay value={stockItem.minStock} suffix={unit ?? undefined} />
          </div>
        )}
      </div>
    </div>
  );
}
