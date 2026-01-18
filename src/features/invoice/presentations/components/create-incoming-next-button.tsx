"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { useMemo } from "react";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";

const VISIBLE_STATE: Step[] = ["select-client"];

export function CreateIncomingNextButton() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();
  const { recipient } = useCreateIncomingInvoiceProvider();

  const disabled = useMemo(() => {
    if (currentStep === "select-client" && !!recipient) return false;
    return true;
  }, [currentStep, recipient]);

  const nextStep = () => {
    if (disabled || !setCurrentStep) return;

    if (currentStep === "select-client") setCurrentStep("invoices");
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <PrimaryButton label="Lanjutkan" onClick={nextStep} disabled={disabled} />;
}
