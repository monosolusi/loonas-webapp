"use client";

import { TextInput, TextInputProps } from "@/core/presentations/components/text-inputs/text-input";
import React from "react";

type PhoneNumberInputProps = {
  label?: string;
  placeholder?: string;
} & Omit<TextInputProps, "label" | "type" | "inputMode" | "pattern">;

export default function PhoneNumberInput({
  label = "Nomor Telpon",
  placeholder = "Masukan nomor telpon Anda (cth: 081234567890)",
  onChange: onChangeProp,
  ...restProps
}: PhoneNumberInputProps) {
  const onChange = (value: string) => {
    // Only allow numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    onChangeProp?.(numericValue);
  };

  return (
    <TextInput
      {...restProps}
      label={label}
      type="tel"
      placeholder={placeholder}
      onChange={onChange}
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
}
