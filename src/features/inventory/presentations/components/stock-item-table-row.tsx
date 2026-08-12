"use client";

import clsx from "clsx";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTypeLabel, StockItemTypeType } from "@/features/inventory/domain/enums/stock-item-type";

/**
 * The Item / Tipe / SKU / Stok Terkini / Stok Min. / Aksi row, shared by the
 * Stok Negatif and Penyesuaian Stok lists. The two pages differ only in which
 * actions a row offers and how the balance is toned, so those arrive as props;
 * everything a reader compares between the two lists — column order, widths,
 * alignment, null treatment — is fixed here so it cannot drift.
 */
export const STOCK_ITEM_ROW_GRID = "grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_40px]";

type StockItemTableRowProps = {
  stockItem: StockItemEntity;
  /** Text colour for the current-balance cell; the owning page decides. */
  toneClass: string;
  options: ActionMenuOption[];
};

export function StockItemTableRow({ stockItem, toneClass, options }: StockItemTableRowProps) {
  return (
    <div
      className={clsx(
        "grid items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0",
        STOCK_ITEM_ROW_GRID,
      )}
    >
      <span className="truncate text-sm leading-5 text-neutral-500">{stockItem.itemName}</span>
      <span className="text-sm leading-5 text-neutral-400">
        {StockItemTypeLabel[stockItem.type as StockItemTypeType] ?? stockItem.type}
      </span>
      <span className="truncate text-sm leading-5 text-neutral-300">{stockItem.sku ?? "—"}</span>
      <span className={clsx("text-right text-sm leading-5 font-medium", toneClass)}>
        <NumberDisplay value={stockItem.currentStock} />
      </span>
      <span className="text-right text-sm leading-5 text-neutral-400">
        {stockItem.minStock !== null ? <NumberDisplay value={stockItem.minStock} /> : "—"}
      </span>
      <div className="flex items-center justify-end">
        {/* An ActionMenu with no options renders an empty popover, which reads as
            broken — leave the cell empty instead. */}
        {options.length > 0 && <ActionMenu options={options} />}
      </div>
    </div>
  );
}
