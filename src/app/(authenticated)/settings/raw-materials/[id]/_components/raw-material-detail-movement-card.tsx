"use client";

import { useMemo } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useRawMaterialDetail } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";
import { RawMaterialMovementList } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-movement-list";

const GRID_COLS = "grid-cols-[1fr_1fr_0.6fr_1.5fr]";

export function RawMaterialDetailMovementCard() {
  const { rawMaterial } = useRawMaterialDetail();
  const stockResult = useListStockItems({ type: StockItemType.RAW_MATERIAL, limit: 100 });

  const stockItemId = useMemo(() => {
    if (!stockResult.stockItems) return null;
    return stockResult.stockItems.find((item) => item.rawMaterial?.id === rawMaterial.id)?.id ?? null;
  }, [rawMaterial.id, stockResult.stockItems]);

  if (stockResult.loading || !stockItemId) return null;

  return (
    <SectionCard title="Riwayat Pergerakan Stok">
      <div className="-mx-6 -mb-6">
        <div className={`grid ${GRID_COLS} gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2`}>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tipe</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Jumlah</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Catatan</span>
        </div>
        <RawMaterialMovementList stockItemId={stockItemId} />
      </div>
    </SectionCard>
  );
}
