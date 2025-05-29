"use client";

import React, { useMemo } from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { TextInput } from "@/core/presentations/components/text-input";
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
    if (tax === numberValue) return; // No Changes

    setTax(numberValue);
  };

  if (taxType === TaxType.NON_TAXABLE) return <TextInput title="Pajak" disabled />;
  return (
    <TextInputWithLeftAddOn
      title="Pajak"
      leftAddOn="Rp"
      textDirection="text-right"
      value={tax.toLocaleString("id-ID")}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
}
