"use client";

import { TextAreaInput } from "@/core/presentations/components/text-area-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { IDENTITY_FIELD_LIMITS } from "@/features/account/domain/constants/identity-field-limits";

export function AddressInput() {
  const { data, update } = usePersonalAccountData();

  return (
    <TextAreaInput
      label="Alamat"
      placeholder="Masukkan alamat lengkap"
      value={data.address ?? ""}
      maxLength={IDENTITY_FIELD_LIMITS.address}
      required
      onChange={(value) => update?.({ address: value })}
    />
  );
}
