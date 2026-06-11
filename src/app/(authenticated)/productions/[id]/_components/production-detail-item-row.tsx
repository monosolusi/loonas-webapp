"use client";

import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductionRecordItemEntity } from "@/features/production/domain/entities/production-record-item";

type ProductionDetailItemRowProps = {
  item: ProductionRecordItemEntity;
};

export function ProductionDetailItemRow({ item }: ProductionDetailItemRowProps) {
  return (
    <div className="grid grid-cols-[1.5fr_0.8fr_1fr_1fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="text-sm leading-5 text-neutral-500">{item.rawMaterial.name}</span>
      <span className="text-sm leading-5 text-neutral-400">
        <NumberDisplay value={item.quantity} suffix={item.rawMaterial.unit} />
      </span>
      <span className="text-right text-sm leading-5 text-neutral-400">
        <CurrencyDisplay value={item.unitCost} />
        <span className="text-neutral-300">/{item.rawMaterial.unit}</span>
      </span>
      <span className="text-right text-sm leading-5 font-medium text-neutral-500">
        <CurrencyDisplay value={item.totalCost} />
      </span>
    </div>
  );
}
