"use client";

import { ReceiptCard } from "@/features/pos/presentations/components/receipt-card";
import { useReceipt } from "@/features/pos/presentations/providers/receipt-provider";

export function ReceiptCardContent() {
  const { sale } = useReceipt();
  return <ReceiptCard sale={sale} />;
}
