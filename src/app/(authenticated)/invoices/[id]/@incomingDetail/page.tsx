"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { TransactionTimelineImpl } from "@/features/invoice/presentations/components/transaction-timeline-impl";
import { InvoiceDocumentListImpl } from "@/app/(authenticated)/invoices/[id]/_components/invoice-document-list-impl";
import { PaymentSummaryImpl } from "@/app/(authenticated)/invoices/[id]/_components/payment-summary-impl";
import { RecipientInfoImpl } from "@/app/(authenticated)/invoices/[id]/_components/recipient-info-impl";

export default function IncomingInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (loading || !invoice || !(invoice instanceof IncomingInvoiceEntity)) {
    return null;
  }

  return (
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
  );
}
