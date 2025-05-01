import { FilledButton } from "@/core/presentations/components/filled-button";
import React from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

export function PayNowButton() {
  const { paymentGateway, paymentScheme } = useCreateIncomingInvoice();
  const { nextStep } = useCreateIncomingInvoiceSteps();

  return (
    <FilledButton
      disabled={!paymentGateway || (paymentGateway.requiresSchemeSelection && !paymentScheme)}
      type="button"
      onClick={() => nextStep?.()}
      className="w-full"
    >
      Bayar Sekarang
    </FilledButton>
  );
}