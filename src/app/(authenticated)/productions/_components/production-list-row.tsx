"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";

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

  const date = record.producedAt.toFormat("dd MMM yyyy");

  return (
    <>
      {/* Desktop: grid row (lg and up) */}
      <Link
        href={`/productions/${record.id}`}
        className="hover:border-l-primary-300 hover:bg-primary-50 hidden grid-cols-[1fr_1.5fr_0.6fr_1fr_48px] items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 lg:grid"
      >
        <span className="text-sm leading-5 text-neutral-400">{date}</span>
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

      {/* Mobile: stacked card (below lg) */}
      <div className="lg:hidden">
        <MobileListCard
          href={`/productions/${record.id}`}
          title={record.productName}
          subtitle={record.variantName}
          meta={
            <>
              {date} · <NumberDisplay value={record.quantity} /> qty
            </>
          }
          trailingTop={<CurrencyDisplay value={record.totalMaterialCost} />}
          trailingBottom={<ActionMenu options={menuOptions} />}
        />
      </div>
    </>
  );
}
