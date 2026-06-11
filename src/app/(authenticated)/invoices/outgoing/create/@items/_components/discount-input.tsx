"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

export function DiscountInput() {
  const { discountType, discount, setDiscount } = useAddItem();

  const handleChange = (value: string) => {
    if (!setDiscount) return;

    const numberValue = Number(value.replace(/\./g, ""));
    if (discount === numberValue) return;

    setDiscount(numberValue);
  };

  if (discountType === DiscountType.NO_DISCOUNT) {
    return <TextInput label="Diskon" disabled />;
  } else if (discountType === DiscountType.PERCENTAGE) {
    return (
      <TextInput
        label="Diskon"
        rightAddOn="%"
        inputTextAlign="text-right"
        value={discount.toLocaleString("id-ID")}
        onChange={handleChange}
      />
    );
  } else if (discountType === DiscountType.FIXED) {
    return (
      <TextInput
        label="Diskon"
        leftAddOn="Rp"
        inputTextAlign="text-right"
        value={discount.toLocaleString("id-ID")}
        onChange={handleChange}
      />
    );
  } else {
    return <TextInput label="Diskon" disabled />;
  }
}
