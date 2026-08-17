"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";
import { resolveCreateAccountButtonState } from "@/app/(user)/onboarding/account/_utils/create-account-button-state";

const LABEL = "Buat Akun Bisnis";
const SUBMITTING_LABEL = "Membuat akun bisnis...";

export function SubmitButton() {
  const { currentStep } = useCreateAccount();
  const { submitStatus } = useBusinessAccountData();

  if (currentStep !== "business.documents") return null;

  // Not gated on form completeness — see the personal twin. An incomplete form submits and gets
  // a named list of what is missing rather than a silent grey button.
  const state = resolveCreateAccountButtonState({
    status: submitStatus,
    label: LABEL,
    submittingLabel: SUBMITTING_LABEL,
  });

  return (
    <PrimaryButton
      label={state.label}
      type="submit"
      disabled={state.disabled}
      loading={state.loading}
      loadingLabel={state.loadingLabel}
      aria-label={state.loading ? state.loadingLabel : state.label}
    />
  );
}
