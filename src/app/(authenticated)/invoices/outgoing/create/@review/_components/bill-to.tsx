import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import React from "react";

export function BilLTo() {
  const { recipient } = useCreateOutgoingInvoice();

  if (!recipient) return null;
  return (
    <>
      <div className="flex-1 text-gray-500 italic">Tagihan Untuk</div>
      <div className="flex-1 text-base font-semibold text-gray-900">{recipient.name}</div>
      <div className="flex-1 text-gray-500">Telp. {recipient.phoneNumber}</div>
      <div className="flex-1 text-gray-500">Email. {recipient.email}</div>
    </>
  );
}
