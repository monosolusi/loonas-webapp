import { InvoiceDocument } from "@/features/invoice/presentations/providers/create-incoming-invoice.types";

export type IncomingInvoiceDocumentInputProps = {
  index: number;
  invoice: InvoiceDocument;
  showDelete: boolean;
  onDelete?: () => void;
  onChange?: (invoice: InvoiceDocument) => void;
};
