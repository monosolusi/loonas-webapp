"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useReceipt } from "@/features/pos/presentations/providers/receipt-provider";

export function ReceiptDetailHeader() {
  const { sale } = useReceipt();
  return <DetailPageHeader title={sale.receiptNumber} backHref="/sales/pos" />;
}
