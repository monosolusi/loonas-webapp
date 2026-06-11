"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { IncomingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-statistics-impl";
import { IncomingInvoiceTableImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-table-impl";

export default function IncomingInvoicePage() {
  return (
    <InvoiceListPageShell
      title="Tagihan"
      description="Pantau semua pengeluaran dan status pembayaran faktur."
      createHref="/invoices/incoming/create"
      statistics={<IncomingInvoiceStatisticsImpl />}
    >
      <IncomingInvoiceTableImpl />
    </InvoiceListPageShell>
  );
}
