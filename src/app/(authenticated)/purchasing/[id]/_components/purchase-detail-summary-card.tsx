"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePurchaseDetail } from "@/app/(authenticated)/purchasing/[id]/_providers/purchase-detail-provider";

export function PurchaseDetailSummaryCard() {
  const { purchase } = usePurchaseDetail();

  return (
    <SectionCard title="Ringkasan" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Total Item</span>
          <span className="text-sm font-medium text-neutral-500">{purchase.items.length} item</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Total Pembelian</span>
          <span className="text-sm font-semibold text-neutral-500">
            Rp <NumberDisplay value={purchase.totalAmount} />
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
