"use client";

import React, { useMemo } from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { TextInput } from "@/core/presentations/components/text-input";
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
    if (taxBase === numberValue) return; // No Changes

    setTaxBase(numberValue);
  };

  if (isDisabled) return <TextInput title="DPP" disabled />;
  return (
    <TextInputWithLeftAddOn
      value={taxBase.toLocaleString("id-ID")}
      onChange={handleChange}
      title="DPP"
      leftAddOn="Rp"
      textDirection="text-right"
      disabled={isDisabled}
    />
  );
}
