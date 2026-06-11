"use client";

import React, { useMemo } from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TaxInput() {
  const { taxType, tax, setTax } = useAddItem();

  const isDisabled = useMemo(() => {
    if (taxType === TaxType.MANUAL_INCLUSIVE) return false;
    else if (taxType === TaxType.MANUAL_EXCLUSIVE) return false;
    else return true;
  }, [taxType]);

  const handleChange = (value: string) => {
    if (!setTax) return;

    const numberValue = Number(value.replace(/\./g, ""));
    if (tax === numberValue) return;

    setTax(numberValue);
  };

  return (
    <TextInput
      label="Pajak"
      leftAddOn="Rp"
      inputTextAlign="text-right"
      value={isDisabled ? "" : tax.toLocaleString("id-ID")}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
}
