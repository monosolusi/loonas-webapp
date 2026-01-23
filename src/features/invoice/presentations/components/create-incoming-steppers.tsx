"use client";

import { CreateInvoiceStepper } from "@/features/invoice/presentations/components/create-invoice-stepper";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { useMemo } from "react";
import { State } from "@/features/invoice/presentations/components/create-invoice-stepper.types";

type Stepper = "select-client" | "invoices" | "client-bank-account" | "select-payment-method";

type StepperValue = {
  active: Step[];
  completed: Step[];
};

// What mark the stepper state as active or completed depends on the current step and the next step
const STEPPER_STATE: Record<Stepper, StepperValue> = {
  "select-client": {
    active: ["select-client", "select-client.create-new"],
    completed: ["invoices", "client-bank-account", "client-bank-account.create-new", "select-payment-method"],
  },
  invoices: {
    active: ["invoices"],
    completed: ["client-bank-account", "client-bank-account.create-new", "select-payment-method"],
  },
  "client-bank-account": {
    active: ["client-bank-account", "client-bank-account.create-new"],
    completed: ["select-payment-method"],
  },
  "select-payment-method": {
    active: ["select-payment-method"],
    completed: [],
  },
};

export function CreateIncomingSteppers() {
  const { currentStep } = useCreateIncomingInvoiceSteps();

  const stepperState = useMemo(() => {
    return (stepper: Stepper): State => {
      if (STEPPER_STATE[stepper].completed.includes(currentStep)) return "completed";
      if (STEPPER_STATE[stepper].active.includes(currentStep)) return "active";
      return "default";
    };
  }, [currentStep]);

  return (
    <div className="w-[280px] border-r border-neutral-200 px-6 py-8">
      <div className="flex flex-col gap-y-1">
        <CreateInvoiceStepper
          title="Client"
          description="Pilih Client"
          iconPath={{
            default: "/assets/images/person-icon-neutral-400-w28-h28.svg",
            active: "/assets/images/person-icon-primary-w28-h28.svg",
          }}
          state={stepperState("select-client")}
        />

        <CreateInvoiceStepper
          title="Detail"
          description="Isi faktur"
          iconPath={{
            default: "/assets/images/document-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/document-icon-primary-300-w24-h24.svg",
          }}
          state={stepperState("invoices")}
        />

        <CreateInvoiceStepper
          title="Rekening"
          description="Tujuan transfer"
          iconPath={{
            default: "/assets/images/building-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/building-icon-primary-w28-h28.svg",
          }}
          state={stepperState("client-bank-account")}
        />

        <CreateInvoiceStepper
          title="Metode Pembayaran"
          description="Cara bayar"
          iconPath={{
            default: "/assets/images/credit-card-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/credit-card-icon-primary-300-w16-h16.svg",
          }}
          state={stepperState("select-payment-method")}
        />

        <CreateInvoiceStepper
          title="Bayar"
          description="Lakukan pembayaran"
          iconPath={{
            default: "/assets/images/dollar-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/dollar-icon-primary-300-w16-h16.svg",
          }}
        />

        <CreateInvoiceStepper
          title="Selesai"
          description="Faktur telah dibuat"
          iconPath={{
            default: "/assets/images/check-circle-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/check-circle-icon-primary-300-w16-h16.svg",
          }}
        />
      </div>
    </div>
  );
}
