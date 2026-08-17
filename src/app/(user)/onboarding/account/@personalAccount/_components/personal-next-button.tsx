"use client";

import { NextButton } from "@/app/(user)/onboarding/account/_components/next-button";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

/**
 * "Selanjutnya" for the personal flow. It validates the step the user is standing on before
 * advancing — previously it advanced unconditionally, which is how a blank step-1 field ended up
 * blocking submit two steps later while being nowhere on screen.
 *
 * It blocks by revealing that step's inline errors rather than by rendering itself disabled: a
 * dead button teaches the user nothing about what is wrong.
 */
export function PersonalNextButton() {
  const { currentStep, nextStep } = useCreateAccount();
  const { validateCurrentStep } = usePersonalAccountData();

  if (currentStep === "personal.documents") return null;

  const onClick = () => {
    if (!validateCurrentStep()) return;
    nextStep?.();
  };

  return <NextButton onClick={onClick} />;
}
