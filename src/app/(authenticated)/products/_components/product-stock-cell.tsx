"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";

type ProductStockCellProps = {
  totalStock: number | null;
};

export function ProductStockCell({ totalStock }: ProductStockCellProps) {
  if (totalStock === null) return <span className="text-right text-sm leading-5 text-neutral-200">—</span>;

  return (
    <span className="text-right text-sm leading-5 text-neutral-400">
      <NumberDisplay value={totalStock} />
    </span>
  );
}
