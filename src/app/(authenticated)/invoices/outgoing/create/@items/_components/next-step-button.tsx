"use client";

import { useMemo } from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { FilledButton } from "@/core/presentations/components/filled-button";

export function NextStepButton() {
  const { nextStep, invoiceNumber, invoiceDate, dueDate, items } = useCreateOutgoingInvoice();

  const isDisabled: boolean = useMemo(() => {
    if (!invoiceNumber) return true;
    else if (invoiceDate.startOf("day") > dueDate.startOf("day")) return true;
    else if (items.length === 0) return true;
    else return false;
  }, [invoiceNumber, invoiceDate, dueDate, items]);

  const handleClick = () => {
    if (isDisabled) return;
    if (!nextStep) return;
    nextStep();
  };

  return (
    <FilledButton type="button" onClick={handleClick} disabled={isDisabled}>
      Selanjutnya
    </FilledButton>
  );
}
