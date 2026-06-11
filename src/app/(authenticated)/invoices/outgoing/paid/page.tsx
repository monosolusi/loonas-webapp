"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { OutgoingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-statistics-impl";
import { OutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table-impl";

export default function OutgoingPaidPage() {
  return (
    <InvoiceListPageShell
      title="Telah Dibayar"
      description="Faktur keluaran yang pembayarannya telah selesai."
      createHref="/invoices/outgoing/create"
      statistics={<OutgoingInvoiceStatisticsImpl />}
    >
      <OutgoingInvoiceTableImpl filter="paid" />
    </InvoiceListPageShell>
  );
}
