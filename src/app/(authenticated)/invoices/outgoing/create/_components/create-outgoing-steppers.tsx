"use client";

import { CreateInvoiceStepper } from "@/features/invoice/presentations/components/create-invoice-stepper";
import { useMemo } from "react";
import { State } from "@/features/invoice/presentations/components/create-invoice-stepper.types";
import {
  OutgoingStep,
  useCreateOutgoingInvoice,
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

type Stepper = "select-recipient" | "invoice-details" | "payment-configuration" | "review-and-send";

type StepperValue = {
  active: OutgoingStep[];
  completed: OutgoingStep[];
};

const STEPPER_STATE: Record<Stepper, StepperValue> = {
  "select-recipient": {
    active: ["select-recipient", "select-recipient.create-new"],
    completed: ["invoice-details", "payment-configuration", "review-and-send"],
  },
  "invoice-details": {
    active: ["invoice-details", "invoice-details.add-item", "invoice-details.edit-item"],
    completed: ["payment-configuration", "review-and-send"],
  },
  "payment-configuration": {
    active: ["payment-configuration"],
    completed: ["review-and-send"],
  },
  "review-and-send": {
    active: ["review-and-send"],
    completed: [],
  },
};

export function CreateOutgoingSteppers() {
  const { currentStep } = useCreateOutgoingInvoice();

  const stepperState = useMemo(() => {
    return (stepper: Stepper): State => {
      if (STEPPER_STATE[stepper].completed.includes(currentStep)) return "completed";
      if (STEPPER_STATE[stepper].active.includes(currentStep)) return "active";
      return "default";
    };
  }, [currentStep]);

  return (
    <div className="w-[280px] shrink-0 border-r border-neutral-200 px-6 py-8">
      <div className="flex flex-col gap-y-1">
        <CreateInvoiceStepper
          title="Penerima"
          description="Pilih penerima"
          iconPath={{
            default: "/assets/images/person-icon-neutral-400-w28-h28.svg",
            active: "/assets/images/person-icon-primary-w28-h28.svg",
          }}
          state={stepperState("select-recipient")}
        />

        <CreateInvoiceStepper
          title="Detail"
          description="Isi detail faktur"
          iconPath={{
            default: "/assets/images/document-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/document-icon-primary-300-w24-h24.svg",
          }}
          state={stepperState("invoice-details")}
        />

        <CreateInvoiceStepper
          title="Pembayaran"
          description="Pengaturan pembayaran"
          iconPath={{
            default: "/assets/images/credit-card-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/credit-card-icon-primary-300-w16-h16.svg",
          }}
          state={stepperState("payment-configuration")}
        />

        <CreateInvoiceStepper
          title="Kirim"
          description="Review dan kirim"
          iconPath={{
            default: "/assets/images/check-circle-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/check-circle-icon-primary-300-w16-h16.svg",
          }}
          state={stepperState("review-and-send")}
        />
      </div>
    </div>
  );
}
