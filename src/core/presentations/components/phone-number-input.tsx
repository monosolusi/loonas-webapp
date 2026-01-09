"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import React from "react";

type PhoneNumberInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export default function PhoneNumberInput({
  value,
  onChange: onChangeProp,
  label = "Nomor Telpon",
  placeholder = "Masukan nomor telpon Anda (cth: 081234567890)",
}: PhoneNumberInputProps) {
  const onChange = (value: string) => {
    // Only allow numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    onChangeProp?.(numericValue);
  };

  return (
    <TextInput
      label={label}
      type="tel"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
}
