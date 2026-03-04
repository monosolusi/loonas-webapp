import { InvoiceModel } from "@/features/invoice/data/models/invoice";
import { OutgoingInvoiceModel } from "@/features/invoice/data/models/outgoing-invoice";

export type InvoiceListItemModel = InvoiceModel | OutgoingInvoiceModel;
