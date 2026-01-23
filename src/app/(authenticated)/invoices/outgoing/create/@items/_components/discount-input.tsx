"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { TextInputWithRightAddOn } from "@/core/presentations/components/text-input-with-right-add-on";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

export function DiscountInput() {
  const { discountType, discount, setDiscount } = useAddItem();

  const handleChange = (value: string) => {
    if (!setDiscount) return;

    const numberValue = Number(value.replace(/\./g, ""));
    if (discount === numberValue) return; // No changes

    setDiscount(numberValue);
  };

  if (discountType === DiscountType.NO_DISCOUNT) {
    return <TextInput title="Diskon" disabled />;
  } else if (discountType === DiscountType.PERCENTAGE) {
    return (
      <TextInputWithRightAddOn
        title="Diskon"
        rightAddOn="%"
        value={discount.toLocaleString("id-ID")}
        onChange={handleChange}
        textDirection="text-right"
      />
    );
  } else if (discountType === DiscountType.FIXED) {
    return (
      <TextInputWithLeftAddOn
        title="Diskon"
        leftAddOn="Rp"
        textDirection="text-right"
        value={discount.toLocaleString("id-ID")}
        onChange={handleChange}
      />
    );
  } else return <TextInput title="Diskon" disabled />;
}
