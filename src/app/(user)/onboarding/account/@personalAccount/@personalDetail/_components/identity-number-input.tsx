"use client";

import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

export function IdentityNumberInput() {
  const { data, update } = usePersonalAccountData();

  return (
    <TextInput
      label="Nomor Identitas / Nomor KTP"
      type="text"
      placeholder="Masukan nomor identitas Anda"
      value={data.identityNumber ?? ""}
      onChange={(value) => update?.({ identityNumber: value })}
    />
  );
}
