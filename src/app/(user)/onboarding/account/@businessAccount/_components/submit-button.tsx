import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PrimaryButton } from "@/core/presentations/components/primary-button";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

export function SubmitButton() {
  const { currentStep } = useCreateAccount();
  const { isClean, isCreating } = useBusinessAccountData();

  if (currentStep !== "business.documents") return null;
  return (
    <PrimaryButton label="Buat Akun Bisnis" type="submit" disabled={!isClean || isCreating} loading={isCreating} />
  );
}
