"use client";

import { GetInvoiceProvider } from "@/features/invoice/presentations/providers/get-invoice";
import { useParams } from "next/navigation";
import { PageContent } from "@/core/presentations/components/page-content";
import {
  InvoiceDetailContentImpl
} from "@/app/(authenticated)/invoices/[id]/@incomingDetail/_components/invoice-detail-content-impl";
import { PageHeadingImpl } from "@/app/(authenticated)/invoices/[id]/@incomingDetail/_components/page-heading-impl";

export default function IncomingInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <GetInvoiceProvider id={id} includes="documents">
      <PageHeadingImpl />
      <PageContent>
        <InvoiceDetailContentImpl />
      </PageContent>
    </GetInvoiceProvider>
  );
}
