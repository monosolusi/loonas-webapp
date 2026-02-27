"use client";

import { useState } from "react";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { IncomingInvoiceRow, IncomingInvoiceTable } from "./incoming-invoice-table";

export function IncomingInvoiceTableImpl() {
  const [page, setPage] = useState(1);
  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.INCOMING,
    page,
    limit: 5,
    includes: "documents",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-neutral-300">Memuat data...</span>
      </div>
    );
  }

  if (error || !invoices || !meta) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-neutral-300">Gagal memuat data faktur.</span>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-neutral-300">Belum ada faktur masuk.</span>
      </div>
    );
  }

  const rows: IncomingInvoiceRow[] = invoices.map((invoice) => {
    const firstDoc = invoice.documents?.[0];
    const extraCount = (invoice.documents?.length ?? 1) - 1;

    return {
      id: invoice.id,
      client: invoice.receiver.name,
      invoiceNumber: firstDoc?.invoiceNumber ?? "-",
      extraInvoices: extraCount > 0 ? extraCount : 0,
      date: invoice.createdAt.setLocale("id").toFormat("dd LLL yyyy"),
      status: invoice.status,
      amount: IDRFormatter.toCurrency(invoice.total),
    };
  });

  return <IncomingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />;
}
