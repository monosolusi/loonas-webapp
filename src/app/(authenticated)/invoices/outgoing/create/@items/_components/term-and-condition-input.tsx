"use client";

import React from "react";
import { TextArea } from "@/core/presentations/components/text-area";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function TermAndConditionInput() {
  const { tnc, setTnc } = useCreateOutgoingInvoice();

  return <TextArea title="Syarat & Ketentuan" value={tnc} onChange={setTnc} />;
}
