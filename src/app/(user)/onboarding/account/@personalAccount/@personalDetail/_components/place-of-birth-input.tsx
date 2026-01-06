"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import {
  usePersonalAccountData
} from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-create-personal-account-data";

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
