import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { SelectInput } from "@/core/presentations/components/select-input";
import React from "react";

interface DiscountTypeProps {
  value?: DiscountType;
  onChange?: (value: DiscountType) => void;
}

export function DiscountTypeSelect(props: DiscountTypeProps) {
  const handleChange = (data: { value: string, label: string }) => {
    if (data.value === "") return;
    if (!props.onChange) return;
    props.onChange(data.value as DiscountType);
  };

  return (
    <SelectInput
      title="Jenis Diskon"
      value={props.value ?? ""}
      onChange={handleChange}
      data={[
        { value: "", label: "Pilih Jenis Diskon" },
        { value: DiscountType.PERCENTAGE, label: "Persentase" },
        { value: DiscountType.FIXED, label: "Fixed" },
        { value: DiscountType.NO_DISCOUNT, label: "Tidak Ada Diskon" }
      ]}
      disableFirstOption
    />
  );
}
