"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useMemo } from "react";
import { useCreatePartnerBankAccountProvider } from "@/features/partner/presentation/providers/create-partner-bank-account.provider";

export function CreateBankAccountButton() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();
  const { isVerified, isCreating, createBankAccount } = useCreatePartnerBankAccountProvider();

  const isVisible = useMemo(() => {
    return currentStep === "client-bank-account.create-new" && isVerified;
  }, [currentStep, isVerified]);

  const onClick = async () => {
    if (!createBankAccount || !setCurrentStep) return;

    await createBankAccount();
    setCurrentStep("client-bank-account");
  };

  if (!isVisible) return null;
  return <PrimaryButton label="Simpan" loading={isCreating} onClick={onClick} />;
}
