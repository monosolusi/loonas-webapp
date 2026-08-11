"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTableRow } from "@/features/inventory/presentations/components/stock-item-table-row";
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

  // This list mixes healthy, low and negative balances, so the tone is a per-row
  // decision here.
  return <StockItemTableRow stockItem={stockItem} toneClass={stockBalanceTone(stockItem)} options={options} />;
}
