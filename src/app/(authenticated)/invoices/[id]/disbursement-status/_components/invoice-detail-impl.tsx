"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { InvoiceDetail } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/invoice-detail";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { isIncomingInvoice } from "@/features/invoice/domain/guards/invoice-guards";

interface InvoiceDetailImplProps {
  id: string;
}

export function InvoiceDetailImpl({ id }: InvoiceDetailImplProps) {
  const { invoice, loading } = useGetInvoice({ id, includes: "documents" });

  if (loading || !invoice || !isIncomingInvoice(invoice)) {
    return <div className="h-[120px] animate-pulse rounded-lg border border-neutral-200 bg-neutral-100" />;
  }

  const documents = (invoice.documents ?? []).map((doc, index) => ({
    number: index + 1,
    invoiceNumber: doc.invoiceNumber ?? "-",
    amount: IDRFormatter.toCurrency(doc.amount),
    date: doc.invoiceDate.toFormat("dd LLLL yyyy"),
  }));

  return <InvoiceDetail documents={documents} />;
}
