"use client";

import React from "react";
import { TextArea } from "@/core/presentations/components/text-area";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function NoteInput() {
  const { note, setNote } = useCreateOutgoingInvoice();

  return <TextArea title="Keterangan" value={note} onChange={setNote} />;
}
