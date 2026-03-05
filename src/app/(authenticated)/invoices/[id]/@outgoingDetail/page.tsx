"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoicePreviewImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/invoice-preview-impl";
import { ErrorDisplayImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/error-display-impl";
import { SendInvoiceButton } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/send-invoice-button";
import { DownloadPdfButton } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/download-pdf-button";
import { OutgoingInvoiceSummaryImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/outgoing-invoice-summary-impl";
import { OutgoingRecipientInfoImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/outgoing-recipient-info-impl";
import { PaymentLinkImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/payment-link-impl";

export default function OutgoingInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (loading || !invoice || !(invoice instanceof OutgoingInvoiceEntity)) {
    return null;
  }

  return (
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
  );
}
