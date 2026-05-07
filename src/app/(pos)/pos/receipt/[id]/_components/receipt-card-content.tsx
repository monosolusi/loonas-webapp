"use client";

import { ReceiptDetailPanel } from "@/features/pos/presentations/components/receipt-detail-panel";
import { useReceipt } from "@/features/pos/presentations/providers/receipt-provider";

export function ReceiptCardContent() {
  const { sale } = useReceipt();
  return <ReceiptDetailPanel sale={sale} />;
}
