"use client";

import { ACCOUNT_STEPS, useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { StepIndicator } from "@/app/(user)/onboarding/account/_components/step-indicator";

export function StepIndicatorImpl() {
  const { type, currentStep } = useCreateAccount();

  if (!type || !currentStep) return null;

  const steps = ACCOUNT_STEPS[type];
  const currentStepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;

  return <StepIndicator currentStep={currentStepIndex + 1} totalSteps={totalSteps} />;
}
