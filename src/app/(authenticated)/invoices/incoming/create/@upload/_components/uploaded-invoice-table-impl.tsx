import {useCreateIncomingInvoice} from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  UploadedInvoiceTable
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/uploaded-invoice-table";

export function UploadedInvoiceTableImpl() {
  const {invoiceDocuments, removeInvoiceDocument} = useCreateIncomingInvoice();

  const handleDeleteDocument = (index: number) => {
    if (!removeInvoiceDocument) return false;
    removeInvoiceDocument(index);
    return true;
  }

  if (invoiceDocuments.length === 0) return null;
  return (
    <UploadedInvoiceTable
      documents={invoiceDocuments}
      onDelete={handleDeleteDocument}
    />
  );
}
