"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { deriveInvoiceSettlementKind } from "@/features/invoice/presentations/components/invoice-payment-helpers";

type InvoiceSettlementChipProps = {
  invoice: OutgoingInvoiceEntity;
};

export function InvoiceSettlementChip({ invoice }: InvoiceSettlementChipProps) {
  const kind = deriveInvoiceSettlementKind(invoice);
  if (kind === "settled") return <StatusChip label="Masuk" variant="success" compact />;
  if (kind === "settling") return <StatusChip label="Proses" variant="warning" compact />;
  return <span className="text-sm text-neutral-300">—</span>;
}
