import { InvoiceDocument } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import React from "react";

export function InvoiceItem({ invoice, index }: { invoice: InvoiceDocument, index: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">
        {invoice.invoiceNumber || `Faktur ${index + 1}`}
      </span>
      <span className="text-gray-900 font-medium">
        {IDRFormatter.toCurrency(invoice.amount)}
      </span>
    </div>
  );
}