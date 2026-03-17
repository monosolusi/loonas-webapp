import React from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { TextInput, TextInputProps } from "@/core/presentations/components/text-inputs/text-input";

type CurrencyInputProps = {
  label?: string;
  placeholder?: string;
  value?: number;
  onChange?: (value: number) => void;
} & Omit<TextInputProps, "label" | "type" | "value" | "onChange">;

export function CurrencyInput({
  label = "Total Tagihan (Rp)",
  placeholder = "0",
  leftIcon = <div className="leading-6 font-semibold text-neutral-400">Rp</div>,
  required = true,
  value,
  onChange: onChangeProp,
  ...restProps
}: CurrencyInputProps) {
  const formatDisplayValue = (numValue: number | undefined): string => {
    if (numValue === undefined || numValue === 0) return "";
    return new Intl.NumberFormat("id-ID").format(numValue);
  };

  const onChange = (newValue: string) => {
    const numericValue = IDRFormatter.toNumber(newValue);
    onChangeProp?.(numericValue);
  };

  return (
    <TextInput
      {...restProps}
      label={label}
      type="text"
      placeholder={placeholder}
      leftIcon={leftIcon}
      value={formatDisplayValue(value)}
      onChange={onChange}
      required={required}
    />
  );
}
