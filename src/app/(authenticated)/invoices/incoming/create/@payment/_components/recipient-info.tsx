import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import React from "react";
import { DetailLineItem } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/detail-line-item";

export function RecipientInfo() {
  const { receiver } = useCreateIncomingInvoice();

  if (!receiver) return;
  return <DetailLineItem title="Penerima" description={receiver.name} />;

}