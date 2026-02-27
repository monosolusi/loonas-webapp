"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { TransactionTimelineImpl } from "@/features/invoice/presentations/components/transaction-timeline-impl";
import { InvoiceDocumentListImpl } from "@/app/(authenticated)/invoices/[id]/_components/invoice-document-list-impl";
import { RecipientInfoImpl } from "@/app/(authenticated)/invoices/[id]/_components/recipient-info-impl";
import { PaymentSummaryImpl } from "@/app/(authenticated)/invoices/[id]/_components/payment-summary-impl";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { invoice } = useGetInvoice({ id });

  const title = invoice?.type === InvoiceType.OUTGOING ? "Faktur Keluaran" : "Faktur Masukan";
  const shortId = id.slice(0, 8);
  const createdDate = invoice?.createdAt.setLocale("id").toFormat("dd LLL yyyy");

  return (
    <div className="flex flex-col gap-y-6">
      {/*  Header */}
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
          <div className="text-xl leading-5 font-bold tracking-tight">{title}</div>
          <div className="text-sm leading-5 text-neutral-200">
            ID: {shortId}{createdDate ? ` · ${createdDate}` : ""}
          </div>
        </div>
      </div>

      {/*  Content */}
      <div className="flex flex-row gap-x-6">
        <div className="flex flex-2 flex-col gap-y-6">
          <TransactionTimelineImpl id={id} />
          {/* Rincian Faktur */}
          <InvoiceDocumentListImpl id={id} />
        </div>
        <div className="flex flex-1 flex-col gap-y-6">
          {/*  Ringkasan Pembayaran */}
          <PaymentSummaryImpl id={id} />

          {/* Informasi Penerima */}
          <RecipientInfoImpl id={id} />
        </div>
      </div>
    </div>
  );
}
