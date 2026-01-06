import { TextAreaInput } from "@/core/presentations/components/text-area-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/_providers/create-account";

export function AddressInput() {
  const { data, update } = usePersonalAccountData();

  return (
    <TextAreaInput
      label="Alamat"
      placeholder="Masukkan alamat lengkap"
      value={data.address ?? ""}
      onChange={(value) => update?.({ address: value })}
    />
  );
}
