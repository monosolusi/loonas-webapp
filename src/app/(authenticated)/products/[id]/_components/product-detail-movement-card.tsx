"use client";

import { useMemo } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { StockMovementTable } from "@/features/inventory/presentations/components/stock-movement-table";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

function hasFinishedGoodsStock(type: string, productionMode: string | null): boolean {
  if (type === ProductType.SERVICE) return false;
  if (type === ProductType.MANUFACTURED && productionMode === ProductionMode.ON_DEMAND) return false;
  return true;
}

export function ProductDetailMovementCard() {
  const { product } = useProductDetail();
  const stockResult = useListStockItems({ type: StockItemType.FINISHED_GOODS, limit: 100 });

  const stockItemIds = useMemo(() => {
    if (!product || !stockResult.stockItems) return [];
    const variantIds = new Set(product.variants.map((v) => v.id));
    return stockResult.stockItems.filter((item) => item.variant && variantIds.has(item.variant.id)).map((item) => item.id);
  }, [product, stockResult.stockItems]);

  const firstStockItemId = stockItemIds[0] ?? undefined;

  if (!product || !hasFinishedGoodsStock(product.type, product.productionMode)) return null;
  if (stockResult.loading || stockItemIds.length === 0) return null;
  if (!firstStockItemId) return null;

  return (
    <SectionCard title="Riwayat Pergerakan Stok" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="-mx-6 -mb-6 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[1fr_1fr_1.5fr_0.8fr_1.5fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Alasan</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Jumlah</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Catatan</span>
          </div>
          <StockMovementTable stockItemId={firstStockItemId} limit={5} />
        </div>
      </div>
    </SectionCard>
  );
}
