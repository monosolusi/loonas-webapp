"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTableRow } from "@/features/inventory/presentations/components/stock-item-table-row";
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

  // This endpoint returns only negative items, so the tone is a page invariant
  // rather than a per-row decision.
  return <StockItemTableRow stockItem={stockItem} toneClass="text-error-400" options={options} />;
}
