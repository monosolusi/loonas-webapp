"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

const VISIBLE_STATE: string[] = ["select-client.create-new"];

export function CreateClientCancelButton() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();

  const onClick = () => {
    setCurrentStep?.("select-client");
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <SecondaryButton label="Batalkan" onClick={onClick} outlined />;
}
