"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { useProductionDetail } from "@/app/(authenticated)/productions/[id]/_providers/production-detail-provider";

export function ProductionDetailCostCard() {
  const { record } = useProductionDetail();

  return (
    <SectionCard title="Biaya Material" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Biaya/Unit</span>
          <span className="text-sm font-medium text-neutral-500">
            <CurrencyDisplay value={record.unitMaterialCost} />
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Total Biaya</span>
          <span className="text-sm font-semibold text-neutral-500">
            <CurrencyDisplay value={record.totalMaterialCost} />
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
