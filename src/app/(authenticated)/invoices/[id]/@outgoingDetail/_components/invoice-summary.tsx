"use client";

import { DetailItem } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/detail-item";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { Card } from "@/core/presentations/components/card";
import { useParams } from "next/navigation";
import { LoadingInvoiceSummary } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/loading-invoice-summary";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

export function InvoiceSummary() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  if (!invoice || loading) return <LoadingInvoiceSummary />;
  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <DetailItem label="ID Faktur">{invoice.id}</DetailItem>
        <div className="flex flex-row justify-between space-x-4 text-left">
          <DetailItem label="ID Faktur">
            <InvoiceStatusChip status={invoice.status} />
          </DetailItem>
          <DetailItem label="Jenis Faktur">Faktur Keluaran</DetailItem>
          <DetailItem label="Nilai Faktur">{IDRFormatter.toCurrency(invoice.summary.total)}</DetailItem>
          <DetailItem label="Tanggal Dibuat">
            {invoice.createdAt.setLocale("id-ID").toFormat("dd MMMM yyyy hh:mm")}
          </DetailItem>
        </div>
      </div>
    </Card>
  );
}
