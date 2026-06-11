"use client";

import React from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

export function DiscountTypeSelect() {
  const { discountType, setDiscountType } = useAddItem();

  const handleChange = (value: string) => {
    if (value === "") return;
    if (!setDiscountType) return;
    if (discountType === value) return;

    setDiscountType(value as DiscountType);
  };

  return (
    <SelectInput
      label="Jenis Diskon"
      value={discountType}
      onChange={handleChange}
      options={[
        { value: DiscountType.PERCENTAGE, label: "Persentase" },
        { value: DiscountType.FIXED, label: "Fixed" },
        { value: DiscountType.NO_DISCOUNT, label: "Tidak Ada Diskon" },
      ]}
    />
  );
}
