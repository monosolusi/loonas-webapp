"use client";

import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PurchaseItemEntity } from "@/features/purchasing/domain/entities/purchase-item";

type PurchaseDetailItemRowProps = {
  item: PurchaseItemEntity;
};

export function PurchaseDetailItemRow({ item }: PurchaseDetailItemRowProps) {
  return (
    <div className="grid grid-cols-[2fr_0.8fr_0.6fr_1fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-sm leading-5 text-neutral-500">{item.itemName}</span>
        {item.variantName && (
          <span className="text-xs leading-4 text-neutral-300">{item.variantName}</span>
        )}
      </div>
      <span className="text-sm leading-5 text-neutral-400">
        <NumberDisplay value={item.quantity} suffix={item.unit ?? undefined} />
      </span>
      <span className="text-right text-sm leading-5 text-neutral-400">
        <span>
          <CurrencyDisplay value={item.unitPrice} />
          <span> / {item.unit ?? undefined}</span>
        </span>
      </span>
      <span className="text-right text-sm leading-5 font-medium text-neutral-500">
        <CurrencyDisplay value={item.totalPrice} />
      </span>
    </div>
  );
}
