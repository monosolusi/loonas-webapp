"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { InvoicePreviewImpl } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/invoice-preview-impl";
import { ErrorDisplayImpl } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/error-display-impl";
import { SendInvoiceButton } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/send-invoice-button";
import { DownloadPdfButton } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/download-pdf-button";
import { OutgoingInvoiceSummaryImpl } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/outgoing-invoice-summary-impl";
import { OutgoingRecipientInfoImpl } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/outgoing-recipient-info-impl";
import { PaymentLinkImpl } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/payment-link-impl";
import { FilteredInvoicePageShell } from "@/app/(authenticated)/invoices/_components/filtered-invoice-page-shell";
import { FilteredOutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/filtered-outgoing-invoice-table-impl";

const FILTER_CONFIG: Record<string, { title: string }> = {
  unpaid: { title: "Faktur Belum Dibayar" },
  paid: { title: "Faktur Telah Dibayar" },
  overdue: { title: "Faktur Jatuh Tempo" },
};

export default function OutgoingInvoiceDynamicPage() {
  const { id } = useParams<{ id: string }>();
  const filterConfig = FILTER_CONFIG[id];

  // Filter view: /invoices/outgoing/unpaid, /invoices/outgoing/paid, /invoices/outgoing/overdue
  if (filterConfig) {
    return (
      <FilteredInvoicePageShell backHref="/invoices/outgoing" title={filterConfig.title}>
        <FilteredOutgoingInvoiceTableImpl filter={id} />
      </FilteredInvoicePageShell>
    );
  }

  // Detail view: /invoices/outgoing/:id
  return <OutgoingInvoiceDetail id={id} />;
}

function OutgoingInvoiceDetail({ id }: { id: string }) {
  const { invoice, loading } = useGetInvoice({ id });

  const shortId = id.slice(0, 8);
  const createdDate = invoice?.createdAt.setLocale("id").toFormat("dd LLL yyyy");

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        title="Faktur Keluaran"
        subtitle={`ID: ${shortId}${createdDate ? ` · ${createdDate}` : ""}`}
      />

      {!loading && invoice instanceof OutgoingInvoiceEntity && (
        <div className="flex flex-row gap-x-6">
          {/* Left column */}
          <div className="flex flex-2 flex-col gap-y-6">
            <ErrorDisplayImpl />
            <InvoicePreviewImpl />
          </div>
          {/* Right column */}
          <div className="flex flex-1 flex-col gap-y-6">
            <OutgoingInvoiceSummaryImpl />
            <OutgoingRecipientInfoImpl />
            <div className="flex flex-col gap-y-2">
              <SendInvoiceButton />
              <PaymentLinkImpl />
              <DownloadPdfButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
