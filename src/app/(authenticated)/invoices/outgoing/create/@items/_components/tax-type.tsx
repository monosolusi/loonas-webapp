import { TaxType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { SelectInput } from "@/core/presentations/components/select-input";
import React from "react";

interface TaxTypeSelectProps {
  value?: TaxType;
  onChange?: (value: TaxType) => void;
}

export function TaxTypeSelect(props: TaxTypeSelectProps) {
  const handleChange = (data: { value: string, label: string }) => {
    if (props.onChange) props.onChange(data.value as TaxType);
  };

  return (
    <SelectInput
      title="Jenis Pajak"
      value={props.value ?? ""}
      onChange={handleChange}
      data={[
        { value: "", label: "Pilih Jenis Pajak" },
        { value: TaxType.INCLUSIVE, label: "Inklusif" },
        { value: TaxType.EXCLUSIVE, label: "Eksklusif" },
        { value: TaxType.SPECIAL_DPP_11_12_EXCLUSIVE, label: "DPP 11/12 Eksklusif" },
        { value: TaxType.NON_TAXABLE, label: "Tidak Kena Pajak" }
      ]}
      disableFirstOption
    />
  );
}
