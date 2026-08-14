"use client";

import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { IDENTITY_FIELD_LIMITS } from "@/features/account/domain/constants/identity-field-limits";

export function FullNameInput() {
  const { data, update } = usePersonalAccountData();

  return (
    <TextInput
      label="Nama Lengkap"
      type="text"
      placeholder="Masukan nama lengkap Anda"
      value={data.fullName ?? ""}
      maxLength={IDENTITY_FIELD_LIMITS.fullName}
      required
      onChange={(value) => update?.({ fullName: value })}
    />
  );
}
