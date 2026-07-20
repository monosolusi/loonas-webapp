"use client";

import { useMemo } from "react";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";

type MobileStep = {
  label: string;
  matches: Step[];
};

const MOBILE_STEPS: MobileStep[] = [
  { label: "Client", matches: ["select-client", "select-client.create-new"] },
  { label: "Detail", matches: ["invoices"] },
  { label: "Rekening", matches: ["client-bank-account", "client-bank-account.create-new"] },
  { label: "Metode Pembayaran", matches: ["select-payment-method"] },
  { label: "Bayar", matches: ["payment"] },
  { label: "Selesai", matches: ["invoice-created"] },
];

export function CreateIncomingMobileProgress() {
  const { currentStep } = useCreateIncomingInvoiceSteps();

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
