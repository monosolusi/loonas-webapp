"use client";

import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { PosSaleStatusBanner } from "@/features/pos/presentations/components/pos-sale-status-banner";
import { PosSaleStatusTimeline } from "@/features/pos/presentations/components/pos-sale-status-timeline";
import { ReceiptCard } from "@/features/pos/presentations/components/receipt-card";

type ReceiptDetailPanelProps = {
  sale: PosSaleEntity;
};

export function ReceiptDetailPanel({ sale }: ReceiptDetailPanelProps) {
  return (
    <div className="flex w-full flex-col gap-y-5">
      <PosSaleStatusBanner sale={sale} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        <ReceiptCard sale={sale} />
        <PosSaleStatusTimeline sale={sale} />
      </div>
    </div>
  );
}
