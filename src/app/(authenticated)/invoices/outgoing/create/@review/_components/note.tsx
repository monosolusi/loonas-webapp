"use client";

import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ExtraInvoiceNote } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/extra-invoice-note";

export function Note() {
  const { note } = useCreateOutgoingInvoice();

  return <ExtraInvoiceNote title="Keterangan">{note}</ExtraInvoiceNote>;
}
