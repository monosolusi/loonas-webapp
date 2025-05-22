import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { InvoiceDetailContentImpl } from "@/app/(authenticated)/invoices/[id]/_components/invoice-detail-content-impl";
import { GetInvoiceProvider } from "@/features/invoice/presentations/providers/get-invoice";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PageContent>
      <GetInvoiceProvider id={id} includes="documents">
        <InvoiceDetailContentImpl />
      </GetInvoiceProvider>
    </PageContent>
  );
}
