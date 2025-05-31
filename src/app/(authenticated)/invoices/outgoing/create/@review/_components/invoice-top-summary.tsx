import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function InvoiceTopSummary() {
  const { invoiceNumber, invoiceDate, dueDate } = useCreateOutgoingInvoice();

  return (
    <div className="flex flex-1 flex-col space-y-1 self-end">
      <h3 className="mb-5 text-right text-2xl font-semibold text-gray-900">INVOICE</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="text-end font-light text-gray-500">Referensi</div>
        <div className="flex-1 text-end font-semibold">{invoiceNumber}</div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1 text-end font-light text-gray-500">Tanggal Invoice</div>
        <div className="text-end font-semibold">{invoiceDate.setLocale("id").toFormat("dd MMMM yyyy")}</div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1 text-end font-light text-gray-500">Tanggal Jatuh Tempo</div>
        <div className="text-end font-semibold">{dueDate.setLocale("id").toFormat("dd MMMM yyyy")}</div>
      </div>
    </div>
  );
}
