"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-input";

export function EmailInput({ value, onChange, className, bold = false, required = false, placeholder }: {
  value?: string,
  onChange?: (value: string) => void,
  className?: string
  bold?: boolean
  required?: boolean
  placeholder?: string
}) {

  return (
    <TextInput
      title="Alamat Email"
      htmlFor="email"
      value={value}
      onChange={onChange}
      autoComplete="email"
      className={className}
      boldLabel={bold}
      type="email"
      required={required}
      placeholder={placeholder}
    />
  );

}