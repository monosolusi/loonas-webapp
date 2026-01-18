"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { useCreateNewPartner } from "@/features/partner/presentation/providers/create-new-partner";

export function CreateClientButton() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();
  const { create, loading } = useCreateNewPartner();

  const onClick = async () => {
    if (!create) return;

    await create();
    setCurrentStep?.("select-client");
  };

  if (currentStep !== "select-client.create-new") return null;
  return <PrimaryButton label="Simpan" onClick={onClick} loading={loading} />;
}
