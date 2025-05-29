"use client";

import React from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TotalWithTaxField() {
  const { total } = useAddItem();

  return (
    <TextInputWithLeftAddOn
      title="Total"
      leftAddOn="Rp"
      textDirection="text-right"
      value={total.toLocaleString("id-ID")}
      disabled
    />
  );
}
