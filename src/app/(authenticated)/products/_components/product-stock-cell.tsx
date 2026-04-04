"use client";

import { useMemo } from "react";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

type ProductStockCellProps = {
  product: ProductEntity;
  stockMap: Map<string, StockItemEntity>;
};

export function ProductStockCell({ product, stockMap }: ProductStockCellProps) {
  const stock = useMemo(() => {
    if (product.type === ProductType.SERVICE) return null;
    if (product.type === ProductType.MANUFACTURED && product.productionMode === ProductionMode.ON_DEMAND) return null;

    let totalStock = 0;
    let isLowStock = false;

    for (const variant of product.variants) {
      const stockItem = stockMap.get(variant.id);
      if (stockItem) {
        totalStock += stockItem.currentStock;
        if (stockItem.isLowStock) isLowStock = true;
      }
    }

    return { totalStock, isLowStock };
  }, [product, stockMap]);

  if (!stock) return <span className="text-sm leading-5 text-neutral-200">—</span>;

  return (
    <div className="flex flex-col items-start gap-y-1">
      <span className="text-sm leading-5 text-neutral-400">{stock.totalStock}</span>
      {stock.isLowStock && <StatusChip label="Rendah" variant="warning" compact />}
    </div>
  );
}
