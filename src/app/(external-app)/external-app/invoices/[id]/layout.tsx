"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";

export default function InvoiceLayoutPage(props: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetPublicOutgoingInvoice({ id });
  const router = useRouter();

  useEffect(() => {
    if (!invoice) return;

    const routerMap: Record<OutgoingInvoiceStatus, string | undefined> = {
      [OutgoingInvoiceStatus.DRAFT]: undefined,
      [OutgoingInvoiceStatus.READY_TO_SEND]: undefined,
      [OutgoingInvoiceStatus.SENT]: undefined,
      [OutgoingInvoiceStatus.PENDING_BANK_TRANSFER]: "paid",
      [OutgoingInvoiceStatus.PAID]: "paid",
      [OutgoingInvoiceStatus.CANCELLED]: undefined,
    };

    const path = routerMap[invoice.status];
    if (!path) return;
    else router.replace(path);
  }, [invoice]);

  return <>{props.children}</>;
}
