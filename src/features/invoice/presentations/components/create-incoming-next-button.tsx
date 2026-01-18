"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";

const VISIBLE_STATE: Step[] = ["select-client"];

export function CreateIncomingNextButton() {
  const { currentStep } = useCreateIncomingInvoiceSteps();

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <PrimaryButton label="Lanjutkan" />;
}
