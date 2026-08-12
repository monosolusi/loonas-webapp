"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { MinStockDialog } from "@/features/inventory/presentations/components/min-stock-dialog";
import { StockAdjustmentDialog } from "@/features/inventory/presentations/components/stock-adjustment-dialog";
import { useRawMaterialDetail } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";
import { INVENTORY_ADJUSTMENT_FEATURE } from "@/features/inventory/presentations/constants/feature-flags";
import clsx from "clsx";

function stockStatusLabel(stockItem: StockItemEntity): { label: string; color: string } {
  if (stockItem.minStock === null) return { label: "Min stok belum diatur", color: "text-neutral-300" };
  if (stockItem.isLowStock) return { label: "Stok rendah", color: "text-warning-400" };
  return { label: "Stok cukup", color: "text-success-400" };
}

export function RawMaterialDetailStockCard() {
  const { rawMaterial } = useRawMaterialDetail();
  const { account } = useGetCurrentAccount();
  const stockResult = useListStockItems({ type: StockItemType.RAW_MATERIAL, limit: 100 });
  const [editingItem, setEditingItem] = useState<StockItemEntity | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<StockItemEntity | null>(null);

  const canAdjust = account?.hasFeature(INVENTORY_ADJUSTMENT_FEATURE) ?? false;

  const stockItem = useMemo(() => {
    if (!stockResult.stockItems) return null;
    return stockResult.stockItems.find((item) => item.rawMaterial?.id === rawMaterial.id) ?? null;
  }, [rawMaterial.id, stockResult.stockItems]);

  if (stockResult.loading || !stockItem) return null;

  const status = stockStatusLabel(stockItem);

  const menuOptions: ActionMenuOption[] = [{ label: "Atur Stok Minimum", onClick: () => setEditingItem(stockItem) }];
  // The menu shape does not depend on the balance — a negative balance is
  // handled by StockAdjustmentDialog, which explains why in a modal rather
  // than the option going missing.
  if (canAdjust) {
    menuOptions.push({ label: "Sesuaikan Stok", onClick: () => setAdjustingItem(stockItem) });
  }

  return (
    <>
      <SectionCard
        title="Stok"
        iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg"
        headerAction={<ActionMenu options={menuOptions} />}
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm text-neutral-300">Stok Saat Ini</span>
            <span className="text-sm font-medium text-neutral-500">
              <NumberDisplay value={stockItem.currentStock} suffix={rawMaterial.unit} />
            </span>
          </div>
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm text-neutral-300">Stok Minimum</span>
            <span className="text-sm font-medium text-neutral-500">
              {stockItem.minStock !== null ? <NumberDisplay value={stockItem.minStock} suffix={rawMaterial.unit} /> : "Belum diatur"}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between">
            <span className="text-sm text-neutral-300">Status Stok</span>
            <span className={clsx("text-sm font-medium", status.color)}>{status.label}</span>
          </div>
        </div>
      </SectionCard>
      <MinStockDialog stockItem={editingItem} onClose={() => setEditingItem(null)} />
      {canAdjust && (
        <StockAdjustmentDialog stockItem={adjustingItem} onClose={() => setAdjustingItem(null)} />
      )}
    </>
  );
}