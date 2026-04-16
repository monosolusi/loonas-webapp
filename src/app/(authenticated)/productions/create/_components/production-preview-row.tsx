"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductionPreviewItemEntity } from "@/features/production/domain/entities/production-preview-item";

type ProductionPreviewRowProps = {
  item: ProductionPreviewItemEntity;
};

export function ProductionPreviewRow({ item }: ProductionPreviewRowProps) {
  const remainder = useMemo(() => item.currentStock - item.quantity, [item.currentStock, item.quantity]);
  const unit = item.rawMaterial.unit;

  return (
    <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr_0.8fr_0.8fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="text-sm leading-5 text-neutral-500">{item.rawMaterial.name}</span>
      <span className="text-sm leading-5 text-neutral-400">
        <NumberDisplay value={item.quantity} suffix={unit} />
      </span>
      <span className="text-sm leading-5 text-neutral-400">
        <NumberDisplay value={item.currentStock} suffix={unit} />
      </span>
      <span className="text-right text-sm leading-5 text-neutral-400">
        <CurrencyDisplay value={item.unitCost} />
      </span>
      <span className="text-right text-sm leading-5 font-medium text-neutral-500">
        <CurrencyDisplay value={item.totalCost} />
      </span>
      <span
        className={clsx(
          "text-right text-sm leading-5 font-medium",
          item.sufficient ? "text-success-400" : "text-error-400",
        )}
      >
        {item.sufficient ? (
          <NumberDisplay value={remainder} suffix={unit} />
        ) : (
          <>Kurang <NumberDisplay value={Math.abs(remainder)} suffix={unit} /></>
        )}
      </span>
    </div>
  );
}
