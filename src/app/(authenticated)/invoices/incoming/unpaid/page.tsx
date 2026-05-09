"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { IncomingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-statistics-impl";
import { IncomingInvoiceTableImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-table-impl";

export default function IncomingUnpaidPage() {
  return (
    <InvoiceListPageShell
      title="Belum Dibayar"
      description="Faktur masukan yang masih menunggu pembayaran."
      createHref="/invoices/incoming/create"
      statistics={<IncomingInvoiceStatisticsImpl />}
    >
      <IncomingInvoiceTableImpl filter="unpaid" />
    </InvoiceListPageShell>
  );
}
