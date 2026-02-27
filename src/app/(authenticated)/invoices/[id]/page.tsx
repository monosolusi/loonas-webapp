"use client";
//
// import { useParams } from "next/navigation";
// import { useGetCombinedInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-combined-invoice-summary";
// import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
// import IncomingInvoiceDetailPage from "@/app/(authenticated)/invoices/[id]/@incomingDetail/page";
// import OutgoingInvoiceDetailPage from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/page";
//
// export default function InvoiceDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { invoice, loading } = useGetCombinedInvoiceSummary({ id });
//
//   if (!invoice || loading) return null;
//   if (invoice.type === InvoiceType.INCOMING) return <IncomingInvoiceDetailPage />;
//   else if (invoice.type === InvoiceType.OUTGOING) return <OutgoingInvoiceDetailPage />;
//   else return null;
// }

import Image from "next/image";
import { useParams } from "next/navigation";
import { TransactionTimelineImpl } from "@/features/invoice/presentations/components/transaction-timeline-impl";
import { InvoiceDocumentListImpl } from "@/app/(authenticated)/invoices/[id]/_components/invoice-document-list-impl";
import { RecipientInfoImpl } from "@/app/(authenticated)/invoices/[id]/_components/recipient-info-impl";
import { PaymentSummaryImpl } from "@/app/(authenticated)/invoices/[id]/_components/payment-summary-impl";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-y-6">
      {/*  Header */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="flex size-9 cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-100">
          <Image
            src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
            alt="arrow-left-icon"
            width={16}
            height={16}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <div className="text-xl leading-5 font-bold tracking-tight">INV/2023/10/001</div>
          <div className="text-sm leading-5 text-neutral-200">Faktur Masukan</div>
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
