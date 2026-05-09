"use client";

import { InvoiceListPageShell } from "@/app/(authenticated)/invoices/_components/invoice-list-page-shell";
import { OutgoingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-statistics-impl";
import { OutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table-impl";

export default function OutgoingWaitingSettlementPage() {
  return (
    <InvoiceListPageShell
      title="Menunggu Settlement"
      description="Dana telah masuk ke Loonas dan sedang diproses untuk diteruskan ke penjual."
      createHref="/invoices/outgoing/create"
      statistics={<OutgoingInvoiceStatisticsImpl />}
    >
      <OutgoingInvoiceTableImpl filter="waiting_settlement" />
    </InvoiceListPageShell>
  );
}
