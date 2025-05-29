"use client";

import React from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function TaxTypeSelect() {
  const { taxType, setTaxType } = useAddItem();

  const handleChange = (data: { value: string; label: string }) => {
    if (!setTaxType) return;
    if (taxType === data.value) return;
    setTaxType(data.value as TaxType);
  };

  return (
    <SelectInput
      title="Jenis Pajak"
      value={taxType}
      onChange={handleChange}
      data={[
        { value: TaxType.MANUAL_INCLUSIVE, label: "Manual Inklusif" },
        { value: TaxType.MANUAL_EXCLUSIVE, label: "Manual Eksklusif" },
        { value: TaxType.NON_TAXABLE, label: "Tidak Kena Pajak" },
      ]}
    />
  );
}
