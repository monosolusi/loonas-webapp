"use client";

import { useMemo } from "react";
import {
  OutgoingStep,
  useCreateOutgoingInvoice,
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

type MobileStep = {
  label: string;
  matches: OutgoingStep[];
};

const MOBILE_STEPS: MobileStep[] = [
  { label: "Penerima", matches: ["select-recipient", "select-recipient.create-new"] },
  { label: "Detail", matches: ["invoice-details", "invoice-details.add-item", "invoice-details.edit-item"] },
  { label: "Pembayaran", matches: ["payment-configuration"] },
  { label: "Kirim", matches: ["review-and-send"] },
];

export function CreateOutgoingMobileProgress() {
  const { currentStep } = useCreateOutgoingInvoice();

  const activeIndex = useMemo(() => {
    const index = MOBILE_STEPS.findIndex((step) => step.matches.includes(currentStep));
    return index === -1 ? 0 : index;
  }, [currentStep]);

  return (
    <div className="border-b border-neutral-200 px-4 py-4 lg:hidden">
      <div className="flex items-center justify-between text-xs text-neutral-300">
        <span>
          Langkah {activeIndex + 1} dari {MOBILE_STEPS.length}
        </span>
        <span className="font-semibold text-neutral-500">{MOBILE_STEPS[activeIndex].label}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-primary-300 transition-all duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${((activeIndex + 1) / MOBILE_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
