"use client";

import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoicePaymentStatusBanner } from "@/features/invoice/presentations/components/invoice-payment-status-banner";
import { InvoicePaymentStatusTimeline } from "@/features/invoice/presentations/components/invoice-payment-status-timeline";
import { PosReceiptCard } from "@/features/invoice/presentations/components/pos-receipt-card";

type PosReceiptDetailPanelProps = {
  invoice: OutgoingInvoiceEntity;
};

export function PosReceiptDetailPanel({ invoice }: PosReceiptDetailPanelProps) {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <InvoicePaymentStatusBanner invoice={invoice} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <PosReceiptCard invoice={invoice} />
        <InvoicePaymentStatusTimeline invoice={invoice} />
      </div>
    </div>
  );
}
