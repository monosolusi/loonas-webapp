"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { deriveInvoicePaymentStatusKind } from "@/features/invoice/presentations/components/invoice-payment-helpers";

type InvoicePaymentStatusChipProps = {
  invoice: OutgoingInvoiceEntity;
};

export function InvoicePaymentStatusChip({ invoice }: InvoicePaymentStatusChipProps) {
  const kind = deriveInvoicePaymentStatusKind(invoice);
  if (kind === "paid") return <StatusChip label="Lunas" variant="success" compact />;
  return <StatusChip label="Menunggu" variant="warning" compact />;
}
