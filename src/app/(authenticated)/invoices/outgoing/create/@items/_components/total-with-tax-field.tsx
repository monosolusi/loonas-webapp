"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TotalWithTaxField() {
  const { total } = useAddItem();

  return (
    <TextInput
      label="Total"
      leftAddOn="Rp"
      inputTextAlign="text-right"
      value={total.toLocaleString("id-ID")}
      disabled
    />
  );
}
