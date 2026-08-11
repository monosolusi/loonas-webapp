"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTypeLabel, StockItemTypeType } from "@/features/inventory/domain/enums/stock-item-type";
import { stockRecoveryActions } from "@/features/inventory/presentations/helpers/stock-recovery-actions";
import { stockBalanceTone } from "@/app/(authenticated)/inventory/stock-adjustment/_utils/stock-balance-tone";

type StockAdjustmentItemRowProps = {
  stockItem: StockItemEntity;
  canAdjust: boolean;
  onAdjust: (stockItem: StockItemEntity) => void;
};

export function StockAdjustmentItemRow({ stockItem, canAdjust, onAdjust }: StockAdjustmentItemRowProps) {
  const router = useRouter();

  const options = useMemo<ActionMenuOption[]>(() => {
    // A negative balance is never adjustable (BE 422
    // STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE) — offer the paths that actually
    // restore the balance rather than an option that dead-ends.
    if (stockItem.isNegativeBalance) {
      return stockRecoveryActions(stockItem).map((action) => ({
        label: action.label,
        onClick: () => router.push(action.href),
      }));
    }
    if (canAdjust) return [{ label: "Sesuaikan Stok", onClick: () => onAdjust(stockItem) }];
    return [];
  }, [stockItem, canAdjust, onAdjust, router]);

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_40px] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="truncate text-sm leading-5 text-neutral-500">{stockItem.itemName}</span>
      <span className="text-sm leading-5 text-neutral-400">
        {StockItemTypeLabel[stockItem.type as StockItemTypeType] ?? stockItem.type}
      </span>
      <span className="truncate text-sm leading-5 text-neutral-300">{stockItem.sku ?? "—"}</span>
      <span className={clsx("text-right text-sm leading-5 font-medium", stockBalanceTone(stockItem))}>
        <NumberDisplay value={stockItem.currentStock} />
      </span>
      <span className="text-right text-sm leading-5 text-neutral-400">
        {stockItem.minStock !== null ? <NumberDisplay value={stockItem.minStock} /> : "—"}
      </span>
      <div className="flex items-center justify-end">
        {/* An ActionMenu with no options renders an empty popover, which reads as
            broken — leave the cell empty instead. */}
        {options.length > 0 && <ActionMenu options={options} />}
      </div>
    </div>
  );
}
