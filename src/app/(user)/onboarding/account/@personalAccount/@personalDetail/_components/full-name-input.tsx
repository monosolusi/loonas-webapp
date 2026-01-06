"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import {
  usePersonalAccountData
} from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-create-personal-account-data";

export function FullNameInput() {
  const { data, update } = usePersonalAccountData();

  return (
    <TextInput
      label="Nama Lengkap"
      type="text"
      placeholder="Masukan nama lengkap Anda"
      value={data.fullName ?? ""}
      onChange={(value) => update?.({ fullName: value })}
    />
  );
}
