import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PrimaryButton } from "@/core/presentations/components/primary-button";

export function SubmitButton() {
  const { currentStep } = useCreateAccount();

  if (currentStep !== "personal.documents") return null;
  return <PrimaryButton label="Buat Akun" type="submit" />;
}
