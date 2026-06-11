import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

export type InvoiceListItemEntity = IncomingInvoiceEntity | OutgoingInvoiceEntity;
