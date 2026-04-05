"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { MovementTypeLabel, MovementTypeType } from "@/features/inventory/domain/enums/movement-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useListStockMovements } from "@/features/inventory/presentations/hooks/use-list-stock-movements";
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
  const movementResult = useListStockMovements({ stockItemId: firstStockItemId, limit: 5 });

  if (!product || !hasFinishedGoodsStock(product.type, product.productionMode)) return null;
  if (stockResult.loading || stockItemIds.length === 0) return null;

  return (
    <SectionCard title="Riwayat Pergerakan Stok" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="-mx-6 -mb-6">
        <div className="grid grid-cols-[1fr_1fr_0.6fr_1.5fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Jumlah</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Catatan</span>
        </div>

        {movementResult.loading && (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-neutral-300">Memuat...</span>
          </div>
        )}

        {!movementResult.loading && (!movementResult.movements || movementResult.movements.length === 0) && (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-neutral-300">Belum ada pergerakan stok</span>
          </div>
        )}

        {movementResult.movements?.map((movement) => (
          <div
            key={movement.id}
            className="grid grid-cols-[1fr_1fr_0.6fr_1.5fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0"
          >
            <span className="text-sm leading-5 text-neutral-400">
              {DateTime.fromISO(movement.createdAt).toFormat("dd MMM yyyy")}
            </span>
            <StatusChip
              label={MovementTypeLabel[movement.type as MovementTypeType] ?? movement.type}
              variant={movement.isStockIn ? "success" : "error"}
              compact
            />
            <span className="text-sm leading-5 text-neutral-400"><NumberDisplay value={Math.abs(movement.quantity)} /></span>
            <span className="truncate text-sm leading-5 text-neutral-300">{movement.note ?? "—"}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
