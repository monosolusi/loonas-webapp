"use client";

import React, { useMemo } from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TotalField() {
  const { qty, price } = useAddItem();

  const total = useMemo(() => {
    if (qty === 0) return 0;
    if (price === 0) return 0;
    return qty * price;
  }, [qty, price]);

  return (
    <TextInputWithLeftAddOn
      title="Jumlah"
      leftAddOn="Rp"
      textDirection="text-right"
      value={total.toLocaleString("id-ID")}
      disabled
    />
  );
}
