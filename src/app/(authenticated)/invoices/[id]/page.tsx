"use client";

import { useParams } from "next/navigation";
import { useGetCombinedInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-combined-invoice-summary";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import IncomingInvoiceDetailPage from "@/app/(authenticated)/invoices/[id]/@incomingDetail/page";
import OutgoingInvoiceDetailPage from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/page";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetCombinedInvoiceSummary({ id });

  if (!invoice || loading) return null;
  if (invoice.type === InvoiceType.INCOMING) return <IncomingInvoiceDetailPage />;
  else if (invoice.type === InvoiceType.OUTGOING) return <OutgoingInvoiceDetailPage />;
  else return null;
}
