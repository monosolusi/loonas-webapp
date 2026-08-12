"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockRowActionMenu } from "@/app/(authenticated)/products/[id]/_components/stock-row-action-menu";

type ProductDetailStockRowProps = {
  stockItem: StockItemEntity;
  onEditMinStock: (stockItem: StockItemEntity) => void;
  onAdjustStock?: (stockItem: StockItemEntity) => void;
  canAdjust?: boolean;
};

export function ProductDetailStockRow({ stockItem, onEditMinStock, onAdjustStock, canAdjust }: ProductDetailStockRowProps) {
  return (
    <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr_40px] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="text-sm leading-5 text-neutral-500">{stockItem.variant?.name ?? "—"}</span>
      <span className="text-sm leading-5 text-neutral-400"><NumberDisplay value={stockItem.currentStock} /></span>
      <span className="text-sm leading-5 text-neutral-400">{stockItem.minStock != null ? <NumberDisplay value={stockItem.minStock} /> : "—"}</span>
      <div>
        {stockItem.isLowStock ? (
          <StatusChip label="Rendah" variant="warning" compact />
        ) : stockItem.minStock !== null ? (
          <StatusChip label="Cukup" variant="success" compact />
        ) : null}
      </div>
      <StockRowActionMenu
        onEditMinStock={() => onEditMinStock(stockItem)}
        onAdjustStock={onAdjustStock ? () => onAdjustStock(stockItem) : undefined}
        // A negative balance is never adjustable (BE 422
        // STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE), so the option would only
        // dead-end in the blocked dialog. Suppress it at the row instead.
        canAdjust={canAdjust && !stockItem.isNegativeBalance}
      />
    </div>
  );
}