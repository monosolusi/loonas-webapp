"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";

type ProductionListRowProps = {
  record: ProductionRecordEntity;
};

export function ProductionListRow({ record }: ProductionListRowProps) {
  const { setDeletingItem } = useProductionList();

  const menuOptions = useMemo<ActionMenuOption[]>(
    () => [
      { label: "Hapus", onClick: () => setDeletingItem(record), variant: "danger" },
    ],
    [record, setDeletingItem],
  );

  return (
    <Link
      href={`/productions/${record.id}`}
      className="hover:border-l-primary-300 hover:bg-primary-50 grid grid-cols-[1fr_1.5fr_0.6fr_1fr_48px] items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
    >
      <span className="text-sm leading-5 text-neutral-400">
        {record.producedAt.toFormat("dd MMM yyyy")}
      </span>
      <div className="flex flex-col">
        <span className="text-sm leading-5 text-neutral-500">{record.productName}</span>
        <span className="text-xs leading-4 text-neutral-300">{record.variantName}</span>
      </div>
      <span className="text-right text-sm leading-5 text-neutral-400">
        <NumberDisplay value={record.quantity} />
      </span>
      <span className="text-right text-sm leading-5 font-semibold text-neutral-500">
        <CurrencyDisplay value={record.totalMaterialCost} />
      </span>
      <div className="flex justify-end">
        <ActionMenu options={menuOptions} />
      </div>
    </Link>
  );
}
