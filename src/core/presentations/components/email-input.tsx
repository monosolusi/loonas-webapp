"use client";

import React from "react";
import { TextInput } from "@/core/presentations/components/text-input";

export function EmailInput({ value, onChange, className, bold = false }: {
  value?: string,
  onChange?: (value: string) => void,
  className?: string
  bold?: boolean
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
      required
    />
  );

}