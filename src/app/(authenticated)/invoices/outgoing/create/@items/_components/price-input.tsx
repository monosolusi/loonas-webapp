"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function PriceInput() {
  const { price, setPrice } = useAddItem();

  const handleChange = (value: string) => {
    if (!setPrice) return;

    const numberValue = Number(value.replace(/\./g, ""));
    if (price === numberValue) return;

    setPrice(numberValue);
  };

  return (
    <TextInput
      label="Harga"
      leftAddOn="Rp"
      inputTextAlign="text-right"
      value={price.toLocaleString("id-ID")}
      onChange={handleChange}
    />
  );
}
