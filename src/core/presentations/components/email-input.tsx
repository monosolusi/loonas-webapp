import Image from "next/image";
import { TextInput, TextInputProps } from "@/core/presentations/components/text-input";
import React, { useState } from "react";
import { isValidEmail } from "@/core/utilities/validation-patterns";

type EmailInputProps = {
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
} & Omit<TextInputProps, "label" | "type" | "error">;

export function EmailInput({
  label = "Email Perusahaan",
  placeholder = "Masukan email perusahaan Anda.",
  leftIcon = <Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />,
  onChange: onChangeProp,
  ...restProps
}: EmailInputProps) {
  const [error, setError] = useState<string | null>(null);

  const onChange = (newValue: string) => {
    if (newValue && !isValidEmail(newValue)) setError("Format email tidak valid");
    else setError(null);

    onChangeProp?.(newValue);
  };

  return (
    <TextInput
      {...restProps}
      label={label}
      type="email"
      placeholder={placeholder}
      leftIcon={leftIcon}
      onChange={onChange}
      error={error}
    />
  );
}
