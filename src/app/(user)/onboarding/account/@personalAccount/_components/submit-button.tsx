"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

export function SubmitButton() {
  const { currentStep } = useCreateAccount();
  const { isClean, isCreating } = usePersonalAccountData();

  if (currentStep !== "personal.documents") return null;
  return (
    <PrimaryButton
      label="Buat Akun"
      type="submit"
      disabled={!isClean && !isCreating}
      loading={isCreating}
      loadingLabel="Membuat akun..."
      aria-label={isCreating ? "Sedang membuat akun..." : "Buat Akun"}
    />
  );
}
