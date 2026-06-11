"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { OutgoingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-statistics-impl";
import { OutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table-impl";

export default function OutgoingInvoicePage() {
  return (
    <InvoiceListPageShell
      title="Penagihan"
      description="Pantau semua penagihan ke pelanggan dan status penerimaannya."
      createHref="/invoices/outgoing/create"
      statistics={<OutgoingInvoiceStatisticsImpl />}
    >
      <OutgoingInvoiceTableImpl />
    </InvoiceListPageShell>
  );
}
