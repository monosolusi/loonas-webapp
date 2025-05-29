"use client";

import React from "react";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function DiscountTypeSelect() {
  const { discountType, setDiscountType } = useAddItem();

  const handleChange = (data: { value: string; label: string }) => {
    if (data.value === "") return;
    if (!setDiscountType) return;
    if (discountType === data.value) return; // No Changes

    setDiscountType(data.value as DiscountType);
  };

  return (
    <SelectInput
      title="Jenis Diskon"
      value={discountType}
      onChange={handleChange}
      data={[
        { value: DiscountType.PERCENTAGE, label: "Persentase" },
        { value: DiscountType.FIXED, label: "Fixed" },
        { value: DiscountType.NO_DISCOUNT, label: "Tidak Ada Diskon" },
      ]}
    />
  );
}
