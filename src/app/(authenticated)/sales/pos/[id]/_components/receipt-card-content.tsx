"use client";

import { PosReceiptDetailPanel } from "@/features/invoice/presentations/components/pos-receipt-detail-panel";
import { usePosReceipt } from "@/features/invoice/presentations/providers/pos-receipt-provider";

export function ReceiptCardContent() {
  const { invoice } = usePosReceipt();
  return <PosReceiptDetailPanel invoice={invoice} />;
}
