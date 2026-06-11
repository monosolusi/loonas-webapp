"use client";

import React, { useMemo } from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TaxBaseField() {
  const { taxType, taxBase, setTaxBase } = useAddItem();

  const isDisabled = useMemo(() => {
    const manualEntry = [TaxType.MANUAL_EXCLUSIVE, TaxType.MANUAL_INCLUSIVE];
    return !manualEntry.includes(taxType);
  }, [taxType]);

  const handleChange = (value: string) => {
    if (isDisabled) return;
    if (!setTaxBase) return;

    const numberValue = Number(value.replace(/\./g, ""));
    if (taxBase === numberValue) return;

    setTaxBase(numberValue);
  };

  return (
    <TextInput
      label="DPP"
      leftAddOn="Rp"
      inputTextAlign="text-right"
      value={isDisabled ? "" : taxBase.toLocaleString("id-ID")}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
}
