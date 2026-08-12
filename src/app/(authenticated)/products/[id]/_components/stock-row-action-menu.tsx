"use client";

import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";

type StockRowActionMenuProps = {
  onEditMinStock: () => void;
  onAdjustStock?: () => void;
  canAdjust?: boolean;
};

export function StockRowActionMenu({ onEditMinStock, onAdjustStock, canAdjust }: StockRowActionMenuProps) {
  const options: ActionMenuOption[] = [{ label: "Atur Stok Minimum", onClick: onEditMinStock }];
  if (canAdjust && onAdjustStock) {
    options.push({ label: "Sesuaikan Stok", onClick: onAdjustStock });
  }

  return <ActionMenu options={options} />;
}