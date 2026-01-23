"use client";

import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import {
  STEP_MAP,
  useCreateIncomingInvoiceSteps,
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

const VISIBLE_STATE: Step[] = ["invoices", "client-bank-account", "select-payment-method"];

export function CreateIncomingBackButton() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();

  const onClick = () => {
    const prevStep = STEP_MAP[currentStep].prev;
    if (prevStep && setCurrentStep) setCurrentStep(prevStep);
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <SecondaryButton label="Sebelumnya" onClick={onClick} outlined />;
}
