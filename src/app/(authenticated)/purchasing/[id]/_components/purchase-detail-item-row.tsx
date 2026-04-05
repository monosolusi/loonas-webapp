"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { PurchaseItemEntity } from "@/features/purchasing/domain/entities/purchase-item";

type PurchaseDetailItemRowProps = {
  item: PurchaseItemEntity;
};

export function PurchaseDetailItemRow({ item }: PurchaseDetailItemRowProps) {
  return (
    <div className="grid grid-cols-[2fr_0.8fr_0.6fr_1fr_1fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-sm leading-5 text-neutral-500">{item.itemName}</span>
        <StatusChip
          label={item.rawMaterial ? "Bahan Baku" : "Produk"}
          variant={item.rawMaterial ? "primary" : "neutral"}
          compact
        />
      </div>
      <span className="text-sm leading-5 text-neutral-400">
        <NumberDisplay value={item.quantity} suffix={item.unit ?? undefined} />
      </span>
      <span className="text-right text-sm leading-5 text-neutral-400">
        <NumberDisplay value={item.unitPrice} />
      </span>
      <span className="text-right text-sm leading-5 font-medium text-neutral-500">
        <NumberDisplay value={item.totalPrice} />
      </span>
    </div>
  );
}
