"use client";

import React from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TaxTypeSelect() {
  const { taxType, setTaxType } = useAddItem();

  const handleChange = (value: string) => {
    if (!setTaxType) return;
    if (taxType === value) return;
    setTaxType(value as TaxType);
  };

  return (
    <SelectInput
      label="Jenis Pajak"
      value={taxType}
      onChange={handleChange}
      options={[
        { value: TaxType.MANUAL_INCLUSIVE, label: "Manual Inklusif" },
        { value: TaxType.MANUAL_EXCLUSIVE, label: "Manual Eksklusif" },
        { value: TaxType.NON_TAXABLE, label: "Tidak Kena Pajak" },
      ]}
    />
  );
}
