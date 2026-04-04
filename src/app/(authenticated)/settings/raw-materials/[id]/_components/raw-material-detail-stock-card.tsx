"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useUpdateStockItem } from "@/features/inventory/presentations/hooks/use-update-stock-item";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";
import { useRawMaterialDetail } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";

export function RawMaterialDetailStockCard() {
  const { rawMaterial } = useRawMaterialDetail();
  const stockResult = useListStockItems({ type: StockItemType.RAW_MATERIAL, limit: 100 });
  const { trigger: updateStockItem, isMutating } = useUpdateStockItem();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [minStockValue, setMinStockValue] = useState("");

  const stockItem = useMemo(() => {
    if (!stockResult.stockItems) return null;
    return stockResult.stockItems.find((item) => item.rawMaterial?.id === rawMaterial.id) ?? null;
  }, [rawMaterial.id, stockResult.stockItems]);

  if (stockResult.loading || !stockItem) return null;

  const handleEditStart = () => {
    setMinStockValue(String(stockItem.minStock ?? ""));
    setEditing(true);
  };

  const handleSave = async () => {
    const parsed = minStockValue.trim() === "" ? null : Number(minStockValue);
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

  return (
    <SectionCard title="Stok">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Stok Saat Ini</span>
          <div className="flex flex-row items-center gap-x-2">
            <span className="text-sm font-medium text-neutral-500">{stockItem.currentStock}</span>
            {stockItem.isLowStock && <StatusChip label="Rendah" variant="warning" compact />}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Stok Minimum</span>
          {editing ? (
            <div className="flex flex-row items-center gap-x-2">
              <div className="w-20">
                <TextInput
                  label=""
                  type="number"
                  value={minStockValue}
                  onChange={setMinStockValue}
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
          ) : (
            <button
              type="button"
              onClick={handleEditStart}
              className="text-sm font-medium text-neutral-500 hover:text-primary-300"
            >
              {stockItem.minStock ?? "Belum diatur"}
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
