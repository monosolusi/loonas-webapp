import Image from "next/image";
import { TextInput } from "@/core/presentations/components/text-input";
import React, { useState } from "react";
import { isValidEmail } from "@/core/utilities/validation-patterns";

type EmailInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
};

export function EmailInput({
  value,
  onChange: onChangeProp,
  label = "Email Perusahaan",
  placeholder = "Masukan email perusahaan Anda.",
  leftIcon = <Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />,
}: EmailInputProps) {
  const [error, setError] = useState<string | null>(null);

  const onChange = (newValue: string) => {
    if (newValue && !isValidEmail(newValue)) {
      setError("Format email tidak valid");
    } else {
      setError(null);
    }
    onChangeProp?.(newValue);
  };

  return (
    <TextInput
      label={label}
      type="email"
      placeholder={placeholder}
      leftIcon={leftIcon}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
}
