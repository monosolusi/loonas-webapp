"use client";

import React from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
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
    <TextInputWithLeftAddOn
      title="Harga"
      leftAddOn="Rp"
      textDirection="text-right"
      value={price.toLocaleString("id-ID")}
      onChange={handleChange}
    />
  );
}
