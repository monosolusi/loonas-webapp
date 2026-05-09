"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { OutgoingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-statistics-impl";
import { OutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table-impl";

export default function OutgoingOverduePage() {
  return (
    <InvoiceListPageShell
      title="Jatuh Tempo"
      description="Faktur keluaran yang telah melewati tanggal jatuh tempo."
      createHref="/invoices/outgoing/create"
      statistics={<OutgoingInvoiceStatisticsImpl />}
    >
      <OutgoingInvoiceTableImpl filter="overdue" />
    </InvoiceListPageShell>
  );
}
