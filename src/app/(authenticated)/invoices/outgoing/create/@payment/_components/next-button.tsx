"use client";

import React, { useMemo } from "react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function NextButton() {
  const { paymentConfiguration, nextStep } = useCreateOutgoingInvoice();

  const isDisabled: boolean = useMemo(() => {
    if (!nextStep) return true;
    if (paymentConfiguration.length === 0) return true;
    return false;
  }, [paymentConfiguration]);

  const handleClick = () => {
    if (isDisabled) return;
    nextStep?.();
  };

  return (
    <FilledButton disabled={isDisabled} onClick={handleClick}>
      Selanjutnya
    </FilledButton>
  );
}
