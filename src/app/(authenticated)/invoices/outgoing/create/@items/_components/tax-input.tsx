import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import React from "react";
import { TextInput } from "@/core/presentations/components/text-input";
import { TaxType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

interface TaxInputProps {
  value?: number;
  onChange?: (value: number) => void;
  taxType?: TaxType;
}

export function TaxInput(props: TaxInputProps) {
  const handleChange = (value: string) => {
    if (!props.onChange) return;
    const numberValue = Number(value.replace(/\./g, ""));
    props.onChange(numberValue);
  };

  if (!props.taxType || props.taxType === TaxType.NON_TAXABLE) return <TextInput title="Pajak" disabled />;
  return (
    <TextInputWithLeftAddOn
      title="Pajak"
      leftAddOn="Rp"
      textDirection="text-right"
      value={props.value?.toLocaleString("id-ID")}
      onChange={handleChange}
    />
  );
}
