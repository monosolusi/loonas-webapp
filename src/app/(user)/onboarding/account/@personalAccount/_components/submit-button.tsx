import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PrimaryButton } from "@/core/presentations/components/primary-button";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-create-personal-account-data";

export function SubmitButton() {
  const { currentStep } = useCreateAccount();
  const { isClean, isCreating } = usePersonalAccountData();

  if (currentStep !== "personal.documents") return null;
  return <PrimaryButton label="Buat Akun" type="submit" disabled={!isClean || isCreating} loading={isCreating} />;
}
