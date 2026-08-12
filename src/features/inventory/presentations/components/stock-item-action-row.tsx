"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTableRow } from "@/features/inventory/presentations/components/stock-item-table-row";
import { stockItemNavigationActions } from "@/features/inventory/presentations/helpers/stock-item-actions";
import { stockBalanceTone } from "@/features/inventory/presentations/helpers/stock-balance-tone";

type StockItemActionRowProps = {
  stockItem: StockItemEntity;
  canAdjust: boolean;
  onAdjust: (stockItem: StockItemEntity) => void;
};

/**
 * The uniform row action menu, shared by every stock item list: purchasing,
 * sale, and (finished goods only) production are always offered, regardless
 * of balance — a negative balance no longer changes the menu's shape. Picking
 * "Sesuaikan Stok" on a negative item still lands on the blocked dialog
 * (`StockAdjustmentDialog`); the menu explains rather than hides.
 */
export function StockItemActionRow({ stockItem, canAdjust, onAdjust }: StockItemActionRowProps) {
  const router = useRouter();

  const options = useMemo<ActionMenuOption[]>(() => {
    const navigationOptions = stockItemNavigationActions(stockItem).map((action) => ({
      label: action.label,
      onClick: () => router.push(action.href),
    }));
    if (!canAdjust) return navigationOptions;
    return [...navigationOptions, { label: "Sesuaikan Stok", onClick: () => onAdjust(stockItem) }];
  }, [stockItem, canAdjust, onAdjust, router]);

  return <StockItemTableRow stockItem={stockItem} toneClass={stockBalanceTone(stockItem)} options={options} />;
}
