"use client";

import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const { currentStep, previousStep } = useCreateOutgoingInvoice();

  const handleBackClick = () => {
    if (currentStep === 0) router.back();
    else previousStep?.();
  };

  return (
    <OutlinedButton onClick={handleBackClick}>
      <ArrowLeftIcon className="size-4 mt-0.5 mr-1" />
      {currentStep === 0 ? "Kembali" : "Langkah Sebelumnya"}
    </OutlinedButton>
  );
}
