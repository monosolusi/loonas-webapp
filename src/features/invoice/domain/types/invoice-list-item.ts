import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

export type InvoiceListItemEntity = InvoiceEntity | OutgoingInvoiceEntity;
