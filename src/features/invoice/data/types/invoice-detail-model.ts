import { IncomingInvoiceModel } from "@/features/invoice/data/models/incoming-invoice";
import { OutgoingInvoiceModel } from "@/features/invoice/data/models/outgoing-invoice";

export type InvoiceDetailModel = IncomingInvoiceModel | OutgoingInvoiceModel;
