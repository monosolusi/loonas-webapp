import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import React from "react";
import { InvoiceItem } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/invoice-item";

export function InvoiceList() {
  const { invoiceDocuments } = useCreateIncomingInvoice();

  if (!invoiceDocuments) return null;
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Faktur</h3>
      <div className="space-y-2">
        {invoiceDocuments.map((doc, index) => <InvoiceItem key={`invdoc_${index}`} invoice={doc} index={index} />)}
      </div>
    </div>
  );
}