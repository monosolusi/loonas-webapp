import Image from "next/image";
import { TextInput, TextInputProps } from "@/core/presentations/components/text-inputs/text-input";
import React, { useState } from "react";
import { isValidEmail } from "@/core/utilities/validation-patterns";

type EmailInputProps = {
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  /** Externally-owned validation copy, e.g. "this field is still empty". */
  error?: string | null;
} & Omit<TextInputProps, "label" | "type" | "error">;

export function EmailInput({
  label = "Email Perusahaan",
  placeholder = "Masukan email perusahaan Anda.",
  leftIcon = <Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />,
  onChange: onChangeProp,
  error: externalError,
  ...restProps
}: EmailInputProps) {
  const [formatError, setFormatError] = useState<string | null>(null);

  const onChange = (newValue: string) => {
    if (newValue && !isValidEmail(newValue)) setFormatError("Format email tidak valid");
    else setFormatError(null);

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
      // The format complaint describes what the user just typed, so it outranks the caller's
      // standing "still required" copy.
      error={formatError ?? externalError}
    />
  );
}
