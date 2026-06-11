import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";

export function isIncomingInvoice(invoice: InvoiceDetailEntity): invoice is IncomingInvoiceEntity {
  return invoice instanceof IncomingInvoiceEntity;
}

export function isOutgoingInvoice(invoice: InvoiceDetailEntity): invoice is OutgoingInvoiceEntity {
  return invoice instanceof OutgoingInvoiceEntity;
}
