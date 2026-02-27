"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { SectionCard } from "@/core/presentations/components/section-card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceDocumentList } from "@/app/(authenticated)/invoices/[id]/_components/invoice-document-list";

interface InvoiceDocumentListImplProps {
  id: string;
}

export function InvoiceDocumentListImpl({ id }: InvoiceDocumentListImplProps) {
  const { invoice, loading } = useGetInvoice({ id, includes: "documents" });

  if (loading || !invoice) {
    return (
      <SectionCard
        title="Rincian Faktur"
        bodyClassName="p-0"
        iconSrc="/assets/images/document-icon-primary-300-w24-h24.svg"
      >
        <div className="flex flex-col gap-y-4 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-row gap-x-4">
              <div className="h-4 w-8 animate-pulse rounded bg-neutral-100" />
              <div className="flex flex-1 flex-col gap-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-60 animate-pulse rounded bg-neutral-100" />
              </div>
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  const documents = (invoice.documents ?? []).map((doc, index) => ({
    number: index + 1,
    invoiceNumber: doc.invoiceNumber ?? "-",
    note: doc.note,
    date: doc.invoiceDate.setLocale("id").toFormat("dd LLL yyyy"),
    amount: IDRFormatter.toCurrency(doc.amount),
    file: doc.file ? { name: doc.file.name, url: doc.file.publicUrl } : undefined,
  }));

  return (
    <SectionCard
      title="Rincian Faktur"
      bodyClassName="p-0"
      iconSrc="/assets/images/document-icon-primary-300-w24-h24.svg"
    >
      <InvoiceDocumentList documents={documents} totalAmount={IDRFormatter.toCurrency(invoice.total)} />
    </SectionCard>
  );
}
