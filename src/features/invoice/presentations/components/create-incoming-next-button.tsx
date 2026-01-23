"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import {
  STEP_MAP,
  useCreateIncomingInvoiceSteps,
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { useMemo, useState } from "react";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { DisclaimerDialog } from "@/features/invoice/presentations/components/disclaimer-dialog";

const VISIBLE_STATE: Step[] = ["select-client", "invoices", "client-bank-account"];

export function CreateIncomingNextButton() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();
  const { isRecipientStepClean, isInvoiceStepClean, isSelectBankAccountStepClean } = useCreateIncomingInvoiceProvider();

  const nextStep = useMemo(() => {
    return STEP_MAP[currentStep].next;
  }, [STEP_MAP, currentStep]);

  const disabled = useMemo(() => {
    if (currentStep === "select-client") return !isRecipientStepClean;
    else if (currentStep === "invoices") return !isInvoiceStepClean;
    else if (currentStep === "client-bank-account") return !isSelectBankAccountStepClean;
    else return true;
  }, [isRecipientStepClean, isInvoiceStepClean, isSelectBankAccountStepClean, currentStep]);

  const canNext = useMemo(() => {
    return disabled || !setCurrentStep || !nextStep ? false : true;
  }, [disabled, setCurrentStep, nextStep]);

  const onNextClick = () => {
    if (!canNext) return;

    if (currentStep === "invoices") setShowDisclaimer(true);
    else setCurrentStep!(nextStep!);
  };

  const onConfirmDisclaimer = () => {
    if (!canNext) return;

    setShowDisclaimer(false);
    setCurrentStep!(nextStep!);
  };

  if (!VISIBLE_STATE.includes(currentStep) || !nextStep) return null;
  return (
    <>
      <DisclaimerDialog
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onConfirm={onConfirmDisclaimer}
      />
      <PrimaryButton label="Lanjutkan" onClick={onNextClick} disabled={!canNext} />
    </>
  );
}
