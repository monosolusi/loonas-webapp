"use client";

import React from "react";
import { useParams } from "next/navigation";
import { InvoiceMetadata } from "./invoice-metadata";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";

export function InvoiceMetadataImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetPublicOutgoingInvoice({ id });

  if (!invoice || loading) return null;
  return (
    <InvoiceMetadata
      id={invoice.id}
      sender={{ name: invoice.sender.name }}
      recipient={{ name: invoice.recipient.name }}
      invoiceValue={invoice.summary.total}
      dueDate={invoice.dueDate}
      createdAt={invoice.createdAt}
    />
  );
}
