"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePurchaseDetail } from "@/app/(authenticated)/purchasing/[id]/_providers/purchase-detail-provider";
import { PurchaseDetailItemRow } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-item-row";

export function PurchaseDetailItemsCard() {
  const { purchase } = usePurchaseDetail();

  return (
    <SectionCard title="Item Pembelian" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="-mx-6 -mb-6 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[2fr_0.8fr_0.6fr_1fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Item</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Jumlah</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Harga Satuan</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Total</span>
          </div>
          {purchase.items.map((item) => (
            <PurchaseDetailItemRow key={item.id} item={item} />
          ))}
          <div className="flex flex-row items-center justify-end gap-x-2 border-t border-neutral-100 px-4 py-3">
            <span className="text-sm text-neutral-300">Total</span>
            <span className="text-sm font-semibold text-neutral-500">
              Rp <NumberDisplay value={purchase.totalAmount} />
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
