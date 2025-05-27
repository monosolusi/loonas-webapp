import { TextInput } from "@/core/presentations/components/text-input";
import React from "react";

interface QtyInputProps {
  value?: number;
  onChange?: (value: number) => void;
}

export function QtyInput(props: QtyInputProps) {
  const handleChange = (value: string) => {
    if (props.onChange) {
      const numberValue = Number(value.replace(/\./g, ""));
      props.onChange(numberValue);
    }
  };

  return (
    <TextInput
      title="Qty"
      type="text"
      inputTextAlign="text-right"
      value={props.value?.toLocaleString("id-ID")}
      onChange={handleChange}
      required
    />
  );
}
