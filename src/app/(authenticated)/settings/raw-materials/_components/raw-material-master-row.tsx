"use client";

import Image from "next/image";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

type RawMaterialMasterRowProps = {
  item: RawMaterialEntity;
};

export function RawMaterialMasterRow({ item }: RawMaterialMasterRowProps) {
  const { setEditingItem, setDeletingItem } = useRawMaterialMaster();

  return (
    <div className="grid grid-cols-[3fr_1fr_120px] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0">
      <span className="text-sm font-medium text-neutral-500">{item.name}</span>
      <span className="text-sm text-neutral-400">
        {RawMaterialUnitLabel[item.unit as RawMaterialUnitType] ?? item.unit}
      </span>
      <div className="flex flex-row items-center justify-end gap-x-2">
        <button
          type="button"
          onClick={() => setEditingItem(item)}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
        >
          <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="edit" width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={() => setDeletingItem(item)}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="delete" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
