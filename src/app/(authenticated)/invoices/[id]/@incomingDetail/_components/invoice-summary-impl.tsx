"use client";

import { InvoiceSummary } from "@/app/(authenticated)/invoices/[id]/_components/invoice-summary";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { useGetIncomingInvoice } from "@/features/invoice/presentations/hooks/use-get-incoming-invoice";
import { useParams } from "next/navigation";

export function InvoiceSummaryImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetIncomingInvoice({ id });

  if (!invoice || loading) return null;
  return (
    <InvoiceSummary
      createdAt={invoice.createdAt}
      id={invoice.id}
      status={invoice.status}
      total={invoice.amount}
      type={InvoiceType.INCOMING}
    />
  );
}
