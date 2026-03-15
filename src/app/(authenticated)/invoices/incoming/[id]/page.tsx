"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { TransactionTimelineImpl } from "@/features/invoice/presentations/components/transaction-timeline-impl";
import { InvoiceDocumentListImpl } from "@/app/(authenticated)/invoices/incoming/[id]/_components/invoice-document-list-impl";
import { PaymentSummaryImpl } from "@/app/(authenticated)/invoices/incoming/[id]/_components/payment-summary-impl";
import { RecipientInfoImpl } from "@/app/(authenticated)/invoices/incoming/[id]/_components/recipient-info-impl";
import { FilteredInvoicePageShell } from "@/app/(authenticated)/invoices/_components/filtered-invoice-page-shell";
import { FilteredIncomingInvoiceTableImpl } from "@/app/(authenticated)/invoices/incoming/[id]/_components/filtered-incoming-invoice-table-impl";

const FILTER_CONFIG: Record<string, { title: string }> = {
  unpaid: { title: "Tagihan Belum Dibayar" },
  paid: { title: "Tagihan Telah Dibayar" },
};

export default function IncomingInvoiceDynamicPage() {
  const { id } = useParams<{ id: string }>();
  const filterConfig = FILTER_CONFIG[id];

  // Filter view: /invoices/incoming/unpaid, /invoices/incoming/paid
  if (filterConfig) {
    return (
      <FilteredInvoicePageShell backHref="/invoices/incoming" title={filterConfig.title}>
        <FilteredIncomingInvoiceTableImpl filter={id} />
      </FilteredInvoicePageShell>
    );
  }

  // Detail view: /invoices/incoming/:id
  return <IncomingInvoiceDetail id={id} />;
}

function IncomingInvoiceDetail({ id }: { id: string }) {
  const { invoice, loading } = useGetInvoice({ id });

  const shortId = id.slice(0, 8);
  const createdDate = invoice?.createdAt.setLocale("id").toFormat("dd LLL yyyy");

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        title="Faktur Masukan"
        subtitle={`ID: ${shortId}${createdDate ? ` · ${createdDate}` : ""}`}
      />

      {!loading && invoice instanceof IncomingInvoiceEntity && (
        <div className="flex flex-row gap-x-6">
          <div className="flex flex-2 flex-col gap-y-6">
            <TransactionTimelineImpl id={id} />
            <InvoiceDocumentListImpl id={id} />
          </div>
          <div className="flex flex-1 flex-col gap-y-6">
            <PaymentSummaryImpl id={id} />
            <RecipientInfoImpl id={id} />
          </div>
        </div>
      )}
    </div>
  );
}
