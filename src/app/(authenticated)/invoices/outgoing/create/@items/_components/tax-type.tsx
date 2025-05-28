import { SelectInput } from "@/core/presentations/components/select-input";
import React from "react";
import { TaxType } from "@/features/tax/domain/enums/tax-type";

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
        { value: TaxType.MANUAL_INCLUSIVE, label: "Manual Inklusif" },
        { value: TaxType.MANUAL_EXCLUSIVE, label: "Manual Eksklusif" },
        { value: TaxType.NON_TAXABLE, label: "Tidak Kena Pajak" }
      ]}
      disableFirstOption
    />
  );
}
