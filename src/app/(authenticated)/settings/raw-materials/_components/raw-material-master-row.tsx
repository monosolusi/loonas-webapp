"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

type RawMaterialMasterRowProps = {
  item: RawMaterialEntity;
  stockItem: StockItemEntity | null;
  onEditMinStock?: () => void;
};

export function RawMaterialMasterRow({ item, stockItem, onEditMinStock }: RawMaterialMasterRowProps) {
  const { setEditingItem, setDeletingItem } = useRawMaterialMaster();

  const menuOptions = useMemo(() => {
    const options: ActionMenuOption[] = [
      { label: "Edit", onClick: () => setEditingItem(item) },
    ];
    if (onEditMinStock) {
      options.push({ label: "Atur Stok Minimum", onClick: onEditMinStock });
    }
    options.push({ label: "Hapus", onClick: () => setDeletingItem(item), variant: "danger" });
    return options;
  }, [item, onEditMinStock, setEditingItem, setDeletingItem]);

  return (
    <Link
      href={`/settings/raw-materials/${item.id}`}
      className="hover:border-l-primary-300 hover:bg-primary-50 grid grid-cols-[2fr_0.8fr_0.6fr_0.6fr_48px] items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
    >
      <span className="text-sm font-medium text-neutral-500">{item.name}</span>
      <span className="text-sm text-neutral-400">
        {RawMaterialUnitLabel[item.unit as RawMaterialUnitType] ?? item.unit}
      </span>
      <span className="text-sm leading-5 text-neutral-400">
        {stockItem ? <NumberDisplay value={stockItem.currentStock} suffix={item.unit} /> : "—"}
      </span>
      <span className="text-sm leading-5 text-neutral-400">
        {stockItem?.minStock != null ? <NumberDisplay value={stockItem.minStock} suffix={item.unit} /> : "—"}
      </span>
      <div className="flex justify-end">
        <ActionMenu options={menuOptions} />
      </div>
    </Link>
  );
}
