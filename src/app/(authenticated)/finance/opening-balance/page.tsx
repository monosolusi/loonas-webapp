"use client";

import { OpeningBalanceWizardProvider } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";
import { WizardStepRouter } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-step-router";
import { WizardLoadingSkeleton } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-loading-skeleton";

export default function OpeningBalancePage() {
  return (
    <OpeningBalanceWizardProvider loading={<WizardLoadingSkeleton />}>
      <WizardStepRouter />
    </OpeningBalanceWizardProvider>
  );
}
