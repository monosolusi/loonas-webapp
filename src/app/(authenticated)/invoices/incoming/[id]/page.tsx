"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
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
  const router = useRouter();
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
  const router = useRouter();
  const { invoice, loading } = useGetInvoice({ id });

  const shortId = id.slice(0, 8);
  const createdDate = invoice?.createdAt.setLocale("id").toFormat("dd LLL yyyy");

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex flex-row items-center gap-x-4">
        <button
          onClick={() => router.back()}
          className="flex size-9 cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-100"
        >
          <Image
            src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
            alt="arrow-left-icon"
            width={16}
            height={16}
          />
        </button>
        <div className="flex flex-col gap-y-1">
          <div className="text-xl leading-5 font-bold tracking-tight">Faktur Masukan</div>
          <div className="text-sm leading-5 text-neutral-200">
            ID: {shortId}{createdDate ? ` · ${createdDate}` : ""}
          </div>
        </div>
      </div>

      {/* Detail */}
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
