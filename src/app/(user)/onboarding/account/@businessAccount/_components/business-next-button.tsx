"use client";

import { NextButton } from "@/app/(user)/onboarding/account/_components/next-button";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

/**
 * "Selanjutnya" for the business flow — the twin of `PersonalNextButton`. Separate components
 * because `useBusinessAccountData` throws outright when the selected account type is personal, so
 * one shared implementation cannot consume both.
 */
export function BusinessNextButton() {
  const { currentStep, nextStep } = useCreateAccount();
  const { validateCurrentStep } = useBusinessAccountData();

  if (currentStep === "business.documents") return null;

  const onClick = () => {
    if (!validateCurrentStep()) return;
    nextStep?.();
  };

  return <NextButton onClick={onClick} />;
}
