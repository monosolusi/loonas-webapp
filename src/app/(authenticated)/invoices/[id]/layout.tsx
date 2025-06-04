"use client";

import React from "react";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { useGetCombinedInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-combined-invoice-summary";
import { useParams } from "next/navigation";

interface InvoiceDetailLayoutProps {
  incomingDetail: React.ReactNode;
  outgoingDetail: React.ReactNode;
}

export default function InvoiceDetailLayout(props: InvoiceDetailLayoutProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetCombinedInvoiceSummary({ id });

  if (!invoice || loading) return null;
  if (invoice.type === InvoiceType.INCOMING) return props.incomingDetail;
  else if (invoice.type === InvoiceType.OUTGOING) return props.outgoingDetail;
  else return null;
}
