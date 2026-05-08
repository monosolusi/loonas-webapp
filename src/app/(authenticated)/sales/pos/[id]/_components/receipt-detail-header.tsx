"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { usePosReceipt } from "@/features/invoice/presentations/providers/pos-receipt-provider";

export function ReceiptDetailHeader() {
  const { invoice } = usePosReceipt();
  return <DetailPageHeader title={invoice.invoiceNumber} backHref="/sales/pos" />;
}
