"use client";

import { ActionMenu } from "@/core/presentations/components/action-menu";

type StockRowActionMenuProps = {
  onEditMinStock: () => void;
};

export function StockRowActionMenu({ onEditMinStock }: StockRowActionMenuProps) {
  return (
    <ActionMenu
      options={[{ label: "Atur Stok Minimum", onClick: onEditMinStock }]}
    />
  );
}
