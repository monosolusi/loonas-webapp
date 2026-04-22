"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { useProductionDetail } from "@/app/(authenticated)/productions/[id]/_providers/production-detail-provider";
import { ProductionDetailItemRow } from "@/app/(authenticated)/productions/[id]/_components/production-detail-item-row";

export function ProductionDetailItemsCard() {
  const { record } = useProductionDetail();

  return (
    <SectionCard title="Bahan Baku Terpakai" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="-mx-6 -mb-6">
        <div className="grid grid-cols-[1.5fr_0.8fr_1fr_1fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Bahan Baku</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Qty Terpakai</span>
          <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Biaya/Unit</span>
          <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Total</span>
        </div>
        {record.items.map((item) => (
          <ProductionDetailItemRow key={item.id} item={item} />
        ))}
        <div className="flex flex-row items-center justify-end gap-x-2 border-t border-neutral-100 px-4 py-3">
          <span className="text-sm text-neutral-300">Total Material</span>
          <span className="text-sm font-semibold text-neutral-500">
            <CurrencyDisplay value={record.totalMaterialCost} />
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
