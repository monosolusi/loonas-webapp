"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

const VISIBLE_STATE: string[] = ["client-bank-account.create-new"];

export function CreatePartnerBankAccountCancelButton() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();

  const onClick = () => {
    setCurrentStep?.("client-bank-account");
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <SecondaryButton label="Batalkan" onClick={onClick} outlined />;
}
