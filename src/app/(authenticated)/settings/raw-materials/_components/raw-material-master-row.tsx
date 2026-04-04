"use client";

import Link from "next/link";
import Image from "next/image";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

export const RAW_MATERIAL_GRID_COLS = "grid-cols-[2fr_0.8fr_0.6fr_0.6fr_120px]";

type RawMaterialMasterRowProps = {
  item: RawMaterialEntity;
  stockItem: StockItemEntity | null;
};

export function RawMaterialMasterRow({ item, stockItem }: RawMaterialMasterRowProps) {
  const { setEditingItem, setDeletingItem } = useRawMaterialMaster();

  return (
    <Link
      href={`/settings/raw-materials/${item.id}`}
      className="hover:border-l-primary-300 hover:bg-primary-50 grid items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
      style={{ gridTemplateColumns: "2fr 0.8fr 0.6fr 0.6fr 120px" }}
    >
      <span className="text-sm font-medium text-neutral-500">{item.name}</span>
      <span className="text-sm text-neutral-400">
        {RawMaterialUnitLabel[item.unit as RawMaterialUnitType] ?? item.unit}
      </span>
      <div className="flex flex-col items-start gap-y-1">
        {stockItem ? (
          <>
            <span className="text-sm leading-5 text-neutral-400">{stockItem.currentStock}</span>
            {stockItem.isLowStock && <StatusChip label="Rendah" variant="warning" compact />}
          </>
        ) : (
          <span className="text-sm leading-5 text-neutral-200">—</span>
        )}
      </div>
      <span className="text-sm leading-5 text-neutral-400">{stockItem?.minStock ?? "—"}</span>
      <div className="flex flex-row items-center justify-end gap-x-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setEditingItem(item);
          }}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
        >
          <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="edit" width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setDeletingItem(item);
          }}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="delete" width={16} height={16} />
        </button>
      </div>
    </Link>
  );
}
