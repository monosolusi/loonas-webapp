"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function QtyInput() {
  const { qty, setQty } = useAddItem();

  const handleChange = (value: string) => {
    if (!setQty) return;

    const numberValue = Number(value.replace(/\./g, ""));
    if (qty === numberValue) return; // No change on this value
    setQty(numberValue);
  };

  return (
    <TextInput
      title="Qty"
      type="text"
      inputTextAlign="text-right"
      value={qty.toLocaleString("id-ID")}
      onChange={handleChange}
      required
    />
  );
}
