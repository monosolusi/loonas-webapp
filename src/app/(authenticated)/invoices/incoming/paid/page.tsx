"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { IncomingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-statistics-impl";
import { IncomingInvoiceTableImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-table-impl";

export default function IncomingPaidPage() {
  return (
    <InvoiceListPageShell
      title="Telah Dibayar"
      description="Faktur masukan yang pembayarannya telah selesai."
      createHref="/invoices/incoming/create"
      statistics={<IncomingInvoiceStatisticsImpl />}
    >
      <IncomingInvoiceTableImpl filter="paid" />
    </InvoiceListPageShell>
  );
}
