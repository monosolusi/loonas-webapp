"use client";

import { useEffect, useState } from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { IDENTITY_FIELD_LIMITS, NIK_PATTERN, PASSPORT_PATTERN } from "@/features/account/domain/constants/identity-field-limits";

export function IdentityNumberInput() {
  const { data, update, submitAttempted } = usePersonalAccountData();
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const isWNI = data.nationality !== "WNA";
  const value = data.identityNumber ?? "";
  const pattern = isWNI ? NIK_PATTERN : PASSPORT_PATTERN;

  useEffect(() => {
    setIsTouched(false);
  }, [data.nationality]);

  const label = isWNI ? "Nomor Induk Kependudukan (NIK)" : "Nomor Paspor";
  const placeholder = isWNI ? "Masukan 16 digit NIK Anda" : "Masukan nomor paspor Anda";
  const errorCopy = isWNI ? "NIK harus terdiri dari 16 digit" : "Nomor paspor tidak boleh kosong";
  const inputMode = isWNI ? "numeric" : "text";

  const showError = (isTouched || !!submitAttempted) && !pattern.test(value);
  const description = isFocused && isWNI ? `${value.length}/${IDENTITY_FIELD_LIMITS.idNumber} digit` : undefined;

  const handleChange = (raw: string) => {
    const cleaned = isWNI
      ? raw.replace(/\D/g, "").slice(0, IDENTITY_FIELD_LIMITS.idNumber)
      : raw.replace(/[^A-Za-z0-9]/g, "").slice(0, IDENTITY_FIELD_LIMITS.idNumber);
    update?.({ identityNumber: cleaned });
  };

  return (
    <TextInput
      label={label}
      type="text"
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      maxLength={IDENTITY_FIELD_LIMITS.idNumber}
      required
      description={description}
      error={showError ? errorCopy : undefined}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        setIsTouched(true);
      }}
    />
  );
}
