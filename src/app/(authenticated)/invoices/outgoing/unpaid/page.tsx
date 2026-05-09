"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { OutgoingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-statistics-impl";
import { OutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table-impl";

export default function OutgoingUnpaidPage() {
  return (
    <InvoiceListPageShell
      title="Belum Dibayar"
      description="Faktur keluaran yang masih menunggu pembayaran dari pelanggan."
      createHref="/invoices/outgoing/create"
      statistics={<OutgoingInvoiceStatisticsImpl />}
    >
      <OutgoingInvoiceTableImpl filter="unpaid" />
    </InvoiceListPageShell>
  );
}
