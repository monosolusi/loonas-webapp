"use client";

import { useMemo } from "react";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

type RawMaterialMasterCardProps = {
  item: RawMaterialEntity;
  stockItem: StockItemEntity | null;
  onEditMinStock?: () => void;
};

export function RawMaterialMasterCard({ item, stockItem, onEditMinStock }: RawMaterialMasterCardProps) {
  const { setEditingItem, setDeletingItem } = useRawMaterialMaster();

  const menuOptions = useMemo(() => {
    const options: ActionMenuOption[] = [{ label: "Edit", onClick: () => setEditingItem(item) }];
    if (onEditMinStock) {
      options.push({ label: "Atur Stok Minimum", onClick: onEditMinStock });
    }
    options.push({ label: "Hapus", onClick: () => setDeletingItem(item), variant: "danger" });
    return options;
  }, [item, onEditMinStock, setEditingItem, setDeletingItem]);

  const unitLabel = RawMaterialUnitLabel[item.unit as RawMaterialUnitType] ?? item.unit;
  const stock = stockItem ? <NumberDisplay value={stockItem.currentStock} suffix={item.unit} /> : "—";
  const minStock = stockItem?.minStock != null ? <NumberDisplay value={stockItem.minStock} suffix={item.unit} /> : "—";

  return (
    <MobileListCard
      href={`/settings/raw-materials/${item.id}`}
      title={item.name}
      subtitle={unitLabel}
      meta={
        <>
          Stok: {stock} · Min: {minStock}
        </>
      }
      trailingBottom={<ActionMenu options={menuOptions} />}
      chevron={false}
    />
  );
}
