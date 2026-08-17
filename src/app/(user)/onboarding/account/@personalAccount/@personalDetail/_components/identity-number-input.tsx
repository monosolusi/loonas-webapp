"use client";

import { useState } from "react";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { IDENTITY_FIELD_LIMITS } from "@/features/account/domain/constants/identity-field-limits";
import {
  identityNumberLabel,
  isWNA,
  sanitizeIdentityNumber,
} from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";
import {
  identityNumberClearedCopy,
  identityNumberErrorCopy,
} from "@/app/(user)/onboarding/account/_utils/nationality-change";

export function IdentityNumberInput() {
  const { data, update, identityNumberCleared, showFieldErrors, issueFor } = usePersonalAccountData();
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const isWNI = !isWNA(data.nationality);
  const value = data.identityNumber ?? "";

  const label = identityNumberLabel(data.nationality);
  const placeholder = isWNI ? "Masukan 16 digit NIK Anda" : "Masukan nomor paspor Anda";
  const inputMode = isWNI ? "numeric" : "text";

  // Visibility is DERIVED, not dismissed: it ends the instant the user types anything, so there is
  // no separate dismiss callback to forget. `identityNumberCleared` only turns true on a genuine
  // nationality switch (see `resolveNationalityChange`) — never on the first selection (QA F9).
  const clearedNotice =
    identityNumberCleared && value === "" ? identityNumberClearedCopy(data.nationality) : undefined;

  // The copy comes from the completeness resolver, which is also what the submit banner reads —
  // one owner, so the inline message and the banner entry cannot drift. Revelation is still
  // local: blurring this field shows its error without waiting for a submit attempt.
  const showError = isTouched || !!showFieldErrors;
  const errorCopy = identityNumberErrorCopy({
    clearedNotice,
    issueCopy: issueFor("identityNumber")?.message,
    showError,
  });
  const description = isFocused && isWNI ? `${value.length}/${IDENTITY_FIELD_LIMITS.idNumber} digit` : undefined;

  const handleChange = (raw: string) => {
    update?.({ identityNumber: sanitizeIdentityNumber(raw, data.nationality) });
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
      error={errorCopy}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        setIsTouched(true);
      }}
    />
  );
}
