"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useUpdateStockItem } from "@/features/inventory/presentations/hooks/use-update-stock-item";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

function hasFinishedGoodsStock(type: string, productionMode: string | null): boolean {
  if (type === ProductType.SERVICE) return false;
  if (type === ProductType.MANUFACTURED && productionMode === ProductionMode.ON_DEMAND) return false;
  return true;
}

function MinStockEditor({ stockItem }: { stockItem: StockItemEntity }) {
  const { showToast } = useToast();
  const { trigger: updateStockItem, isMutating } = useUpdateStockItem();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(stockItem.minStock ?? ""));

  const handleSave = async () => {
    const parsed = value.trim() === "" ? null : Number(value);
    if (parsed !== null && (isNaN(parsed) || parsed < 0)) return;

    try {
      await updateStockItem({ id: stockItem.id, minStock: parsed });
      await revalidateSWRKey(INVENTORY_SWR_KEYS.LIST_STOCK_ITEMS);
      setEditing(false);
      showToast("Stok minimum berhasil diperbarui");
    } catch {
      showToast("Gagal memperbarui stok minimum", "error");
    }
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm leading-5 text-neutral-400 hover:text-primary-300"
      >
        {stockItem.minStock ?? "—"}
      </button>
    );
  }

  return (
    <div className="flex flex-row items-center gap-x-2">
      <div className="w-20">
        <TextInput
          label=""
          type="number"
          value={value}
          onChange={setValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
        />
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={isMutating}
        className="text-xs font-medium text-primary-300 hover:text-primary-400"
      >
        Simpan
      </button>
    </div>
  );
}

function StockRow({ stockItem }: { stockItem: StockItemEntity }) {
  return (
    <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="text-sm leading-5 text-neutral-500">{stockItem.variant?.name ?? "—"}</span>
      <span className="text-sm leading-5 text-neutral-400">{stockItem.currentStock}</span>
      <MinStockEditor stockItem={stockItem} />
      <div>
        {stockItem.isLowStock ? (
          <StatusChip label="Rendah" variant="warning" compact />
        ) : stockItem.minStock !== null ? (
          <StatusChip label="Cukup" variant="success" compact />
        ) : null}
      </div>
    </div>
  );
}

export function ProductDetailStockCard() {
  const { product } = useProductDetail();
  const stockResult = useListStockItems({ type: StockItemType.FINISHED_GOODS, limit: 100 });

  const variantStockItems = useMemo(() => {
    if (!product || !stockResult.stockItems) return [];
    const variantIds = new Set(product.variants.map((v) => v.id));
    return stockResult.stockItems.filter((item) => item.variant && variantIds.has(item.variant.id));
  }, [product, stockResult.stockItems]);

  if (!product || !hasFinishedGoodsStock(product.type, product.productionMode)) return null;
  if (stockResult.loading) return null;

  return (
    <SectionCard title="Stok">
      <div className="-mx-6 -mb-6">
        <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Varian</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Stok</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Min Stok</span>
          <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Status</span>
        </div>
        {variantStockItems.length > 0 ? (
          variantStockItems.map((item) => <StockRow key={item.id} stockItem={item} />)
        ) : (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-neutral-300">Belum ada data stok</span>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
