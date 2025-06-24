"use client";

import { InvoiceSummary } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/invoice-summary";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { useParams } from "next/navigation";
import { LoadingInvoiceSummary } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/loading-invoice-summary";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";

export function InvoiceSummaryImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  if (!invoice || loading) return <LoadingInvoiceSummary />;
  return (
    <InvoiceSummary
      createdAt={invoice.createdAt}
      id={invoice.id}
      status={invoice.status}
      total={invoice.summary.total}
      type={InvoiceType.OUTGOING}
    />
  );
}
