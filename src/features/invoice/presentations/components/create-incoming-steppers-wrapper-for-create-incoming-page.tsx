"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { CreateIncomingSteppers } from "@/features/invoice/presentations/components/create-incoming-steppers";

export function CreateIncomingSteppersWrapperForCreateIncomingPage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();

  return <CreateIncomingSteppers currentStep={currentStep} />;
}
