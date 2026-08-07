"use client";

import { useRouter } from "next/navigation";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemTypeLabel, StockItemTypeType } from "@/features/inventory/domain/enums/stock-item-type";

const INVENTORY_ADJUSTMENT_FEATURE = "inventory_adjustment";

type NegativeStockRowProps = {
  stockItem: StockItemEntity;
  onAdjust: (item: StockItemEntity) => void;
};

export function NegativeStockRow({ stockItem, onAdjust }: NegativeStockRowProps) {
  const router = useRouter();
  const { account } = useGetCurrentAccount();

  const canAdjust = account?.hasFeature(INVENTORY_ADJUSTMENT_FEATURE) ?? false;

  const options: ActionMenuOption[] = [{ label: "Catat Pembelian", onClick: () => router.push("/purchasing/create") }];
  if (canAdjust) {
    options.push({ label: "Sesuaikan Stok", onClick: () => onAdjust(stockItem) });
  }

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_40px] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="truncate text-sm leading-5 text-neutral-500">{stockItem.itemName}</span>
      <span className="text-sm leading-5 text-neutral-400">
        {StockItemTypeLabel[stockItem.type as StockItemTypeType] ?? stockItem.type}
      </span>
      <span className="truncate text-sm leading-5 text-neutral-300">{stockItem.sku ?? "—"}</span>
      <span className="text-sm leading-5 font-medium text-error-400">
        <NumberDisplay value={stockItem.currentStock} />
      </span>
      <span className="text-sm leading-5 text-neutral-400">
        {stockItem.minStock !== null ? <NumberDisplay value={stockItem.minStock} /> : "—"}
      </span>
      <div className="flex items-center justify-end">
        <ActionMenu options={options} />
      </div>
    </div>
  );
}