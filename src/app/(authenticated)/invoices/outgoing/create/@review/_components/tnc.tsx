"use client";

import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ExtraInvoiceNote } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/extra-invoice-note";

export function Tnc() {
  const { tnc } = useCreateOutgoingInvoice();

  return <ExtraInvoiceNote title="Syarat & Ketentuan">{tnc}</ExtraInvoiceNote>;
}
