"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";
import { ProductDetailStockRow } from "@/app/(authenticated)/products/[id]/_components/product-detail-stock-row";
import { StockMinStockDialog } from "@/app/(authenticated)/products/[id]/_components/stock-min-stock-dialog";

function hasFinishedGoodsStock(type: string, productionMode: string | null): boolean {
  if (type === ProductType.SERVICE) return false;
  if (type === ProductType.MANUFACTURED && productionMode === ProductionMode.ON_DEMAND) return false;
  return true;
}

export function ProductDetailStockCard() {
  const { product } = useProductDetail();
  const stockResult = useListStockItems({ type: StockItemType.FINISHED_GOODS, limit: 100 });
  const [editingItem, setEditingItem] = useState<StockItemEntity | null>(null);

  const variantStockItems = useMemo(() => {
    if (!product || !stockResult.stockItems) return [];
    const variantIds = new Set(product.variants.map((v) => v.id));
    return stockResult.stockItems.filter((item) => item.variant && variantIds.has(item.variant.id));
  }, [product, stockResult.stockItems]);

  if (!product || !hasFinishedGoodsStock(product.type, product.productionMode)) return null;
  if (stockResult.loading) return null;

  return (
    <>
      <SectionCard title="Stok" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
        <div className="-mx-6 -mb-6">
          <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr_40px] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Varian</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Stok</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Min Stok</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Status</span>
            <span />
          </div>
          {variantStockItems.length > 0 ? (
            variantStockItems.map((item) => (
              <ProductDetailStockRow key={item.id} stockItem={item} onEditMinStock={setEditingItem} />
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-neutral-300">Belum ada data stok</span>
            </div>
          )}
        </div>
      </SectionCard>
      <StockMinStockDialog stockItem={editingItem} onClose={() => setEditingItem(null)} />
    </>
  );
}
