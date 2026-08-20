"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/personal-account-provider";
import { resolveCreateAccountButtonState } from "@/app/(user)/onboarding/account/_utils/create-account-button-state";

const LABEL = "Buat Akun";
const SUBMITTING_LABEL = "Membuat akun...";

export function SubmitButton() {
  const { currentStep } = useCreateAccount();
  const { submitStatus } = usePersonalAccountData();

  if (currentStep !== "personal.documents") return null;

  // The button is NOT gated on form completeness. An incomplete form still submits, and the
  // handler answers with a named list of what is missing plus a jump to the step it lives on —
  // rather than going grey with nothing to explain it (QA finding F8).
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
