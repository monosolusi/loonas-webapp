"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
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
    <SecondaryButton
      outlined
      label={currentStep === 0 ? "Kembali" : "Langkah Sebelumnya"}
      leftIcon={<ArrowLeftIcon className="size-4" />}
      onClick={handleBackClick}
    />
  );
}
