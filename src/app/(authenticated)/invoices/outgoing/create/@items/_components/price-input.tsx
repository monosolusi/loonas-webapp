import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import React from "react";

interface PriceInputProps {
  value?: number;
  onChange?: (value: number) => void;
}

export function PriceInput(props: PriceInputProps) {
  const handleChange = (value: string) => {
    if (props.onChange) {
      const numberValue = Number(value.replace(/\./g, ""));
      props.onChange(numberValue);
    }
  };

  return (
    <TextInputWithLeftAddOn
      title="Harga"
      leftAddOn="Rp"
      textDirection="text-right"
      value={props.value?.toLocaleString("id-ID")}
      onChange={handleChange}
    />
  );
}
