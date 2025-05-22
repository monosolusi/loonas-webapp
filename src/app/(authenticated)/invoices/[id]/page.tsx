import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { InvoiceDetailContentImpl } from "@/app/(authenticated)/invoices/[id]/_components/invoice-detail-content-impl";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageContent>
      {/*<GetInvoiceProvider invoiceId={id}>*/}
      <InvoiceDetailContentImpl />
      {/*</GetInvoiceProvider>*/}
    </PageContent>
  );
}
