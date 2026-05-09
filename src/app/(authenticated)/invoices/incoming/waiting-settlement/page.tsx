"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { IncomingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-statistics-impl";
import { IncomingInvoiceTableImpl } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-table-impl";

export default function IncomingWaitingSettlementPage() {
  return (
    <InvoiceListPageShell
      title="Menunggu Settlement"
      description="Dana telah diterima Loonas dan sedang diproses untuk diteruskan ke penerima."
      createHref="/invoices/incoming/create"
      statistics={<IncomingInvoiceStatisticsImpl />}
    >
      <IncomingInvoiceTableImpl filter="waiting_settlement" />
    </InvoiceListPageShell>
  );
}
