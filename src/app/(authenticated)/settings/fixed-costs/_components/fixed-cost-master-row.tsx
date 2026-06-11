"use client";

import Image from "next/image";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";

type FixedCostMasterRowProps = {
  item: FixedCostEntity;
};

export function FixedCostMasterRow({ item }: FixedCostMasterRowProps) {
  const { setEditingItem, setDeletingItem } = useFixedCostMaster();

  return (
    <div className="grid grid-cols-[1fr_120px] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0">
      <span className="text-sm font-medium text-neutral-500">{item.name}</span>
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
