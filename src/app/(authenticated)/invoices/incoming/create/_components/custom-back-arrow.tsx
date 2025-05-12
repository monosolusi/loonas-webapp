"use client";

import { BackArrow } from "@/core/presentations/components/back-arrow";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { useRouter } from "next/navigation";

export function CustomBackArrow() {
  const router = useRouter();
  const { currentStep, prevStep } = useCreateIncomingInvoiceSteps();

  const handleBack = () => {
    if (currentStep === 0) router.back();
    else prevStep?.();
  };

  return (
    <BackArrow onClick={handleBack} />
  );
}