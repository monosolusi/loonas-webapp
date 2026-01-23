"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { useRouter } from "next/navigation";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";

const VISIBLE_STATE: Step[] = ["select-client"];

export function CreateIncomingCancelButton() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <SecondaryButton label="Batalkan" onClick={onClick} outlined />;
}
