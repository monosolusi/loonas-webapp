"use client";

import { useOpeningBalanceWizard } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";
import { WizardIntroStep } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-intro-step";
import { WizardDateStep } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-date-step";
import { WizardBalancesStep } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-balances-step";
import { WizardReviewStep } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-review-step";
import { OpeningBalanceReadonly } from "@/app/(authenticated)/finance/opening-balance/_components/opening-balance-readonly";
import { WizardFetchError } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-fetch-error";

export function WizardStepRouter() {
  const { step } = useOpeningBalanceWizard();

  if (step === "error") return <WizardFetchError />;
  if (step === "readonly") return <OpeningBalanceReadonly />;
  if (step === "intro") return <WizardIntroStep />;
  if (step === "date") return <WizardDateStep />;
  if (step === "balances") return <WizardBalancesStep />;
  if (step === "review") return <WizardReviewStep />;

  return null;
}
