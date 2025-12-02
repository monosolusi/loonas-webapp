"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/_providers/create-account";

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
