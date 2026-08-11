"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTypeLabel, StockItemTypeType } from "@/features/inventory/domain/enums/stock-item-type";
import { stockRecoveryActions } from "@/features/inventory/presentations/helpers/stock-recovery-actions";

type NegativeStockRowProps = {
  stockItem: StockItemEntity;
};

export function NegativeStockRow({ stockItem }: NegativeStockRowProps) {
  const router = useRouter();

  // Every item on this list is negative, and a negative balance can never be
  // adjusted (BE 422 STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE) — only recovered. The
  // inventory-adjustment feature flag is therefore irrelevant here.
  const options = useMemo<ActionMenuOption[]>(
    () =>
      stockRecoveryActions(stockItem).map((action) => ({
        label: action.label,
        onClick: () => router.push(action.href),
      })),
    [stockItem, router],
  );

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_40px] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="truncate text-sm leading-5 text-neutral-500">{stockItem.itemName}</span>
      <span className="text-sm leading-5 text-neutral-400">
        {StockItemTypeLabel[stockItem.type as StockItemTypeType] ?? stockItem.type}
      </span>
      <span className="truncate text-sm leading-5 text-neutral-300">{stockItem.sku ?? "—"}</span>
      <span className="text-sm leading-5 font-medium text-error-400">
        <NumberDisplay value={stockItem.currentStock} />
      </span>
      <span className="text-sm leading-5 text-neutral-400">
        {stockItem.minStock !== null ? <NumberDisplay value={stockItem.minStock} /> : "—"}
      </span>
      <div className="flex items-center justify-end">
        <ActionMenu options={options} />
      </div>
    </div>
  );
}
