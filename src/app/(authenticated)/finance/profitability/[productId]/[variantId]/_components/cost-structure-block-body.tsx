"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { VariantProductionCostEntity } from "@/features/profitability/domain/entities/variant-production-cost";

type CostStructureBlockBodyProps = {
  productionCost: VariantProductionCostEntity;
};

export function CostStructureBlockBody({ productionCost }: CostStructureBlockBodyProps) {
  return (
    <SectionCard title="Struktur Biaya">
      <dl className="flex flex-col gap-y-3">
        <div className="flex flex-row justify-between">
          <dt className="text-sm text-neutral-500">Biaya Tetap</dt>
          <dd className="text-sm font-medium text-neutral-500">
            {IDRFormatter.toCurrency(productionCost.fixedComponent)}
          </dd>
        </div>
        <div className="flex flex-row justify-between">
          <dt className="text-sm text-neutral-500">Biaya Variabel</dt>
          <dd className="text-sm font-medium text-neutral-500">
            {IDRFormatter.toCurrency(productionCost.variableComponent)}
          </dd>
        </div>
        <div className="border-t border-neutral-100" />
        <div className="flex flex-row justify-between">
          <dt className="text-sm font-semibold text-neutral-500">Total Biaya Produksi</dt>
          <dd className="text-sm font-bold text-neutral-500">
            {IDRFormatter.toCurrency(productionCost.totalProductionCost)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-neutral-300">
        Per {productionCost.quantity} unit produksi.
      </p>
    </SectionCard>
  );
}
