"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function HeaderAddItemButton() {
  const { setCurrentStep } = useCreateOutgoingInvoice();

  const handleClick = () => {
    setCurrentStep?.("invoice-details.add-item");
  };

  return <PrimaryButton type="button" label="Tambah Item" onClick={handleClick} />;
}
