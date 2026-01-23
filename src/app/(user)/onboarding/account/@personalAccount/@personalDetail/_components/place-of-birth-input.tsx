"use client";

import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

export function PlaceOfBirthInput() {
  const { data, update } = usePersonalAccountData();

  return (
    <TextInput
      label="Tempat Lahir"
      type="text"
      placeholder="Masukan tempat lahir Anda"
      value={data.placeOfBirth ?? ""}
      onChange={(value) => update?.({ placeOfBirth: value })}
    />
  );
}
