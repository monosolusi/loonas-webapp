"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { useRouter } from "next/navigation";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function CustomBackArrow() {
  const router = useRouter();
  const { currentStep, prevStep } = useCreateIncomingInvoiceSteps();

  const handleBack = () => {
    if (currentStep - 1 === 0) router.back();
    else prevStep?.();
  };

  return (
    <OutlinedButton onClick={handleBack}>
      <ArrowLeftIcon className="mt-0.5 mr-1 size-4" />
      {currentStep - 1 === 0 ? "Kembali" : "Langkah Sebelumnya"}
    </OutlinedButton>
  );
}
