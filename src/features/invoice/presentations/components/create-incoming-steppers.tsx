"use client";

import { CreateInvoiceStepper } from "@/features/invoice/presentations/components/create-invoice-stepper";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { useMemo } from "react";
import { State } from "@/features/invoice/presentations/components/create-invoice-stepper.types";
import { CreateIncomingSteppersProps } from "@/features/invoice/presentations/components/create-incoming-steppers.types";

type Stepper =
  | "select-client"
  | "invoices"
  | "client-bank-account"
  | "select-payment-method"
  | "payment"
  | "invoice-created";

type StepperValue = {
  active: Step[];
  completed: Step[];
};

// What mark the stepper state as active or completed depends on the current step and the next step
const STEPPER_STATE: Record<Stepper, StepperValue> = {
  "select-client": {
    active: ["select-client", "select-client.create-new"],
    completed: [
      "invoices",
      "client-bank-account",
      "client-bank-account.create-new",
      "select-payment-method",
      "payment",
      "invoice-created",
    ],
  },
  invoices: {
    active: ["invoices"],
    completed: [
      "client-bank-account",
      "client-bank-account.create-new",
      "select-payment-method",
      "payment",
      "invoice-created",
    ],
  },
  "client-bank-account": {
    active: ["client-bank-account", "client-bank-account.create-new"],
    completed: ["select-payment-method", "payment", "invoice-created"],
  },
  "select-payment-method": {
    active: ["select-payment-method"],
    completed: ["payment", "invoice-created"],
  },
  payment: {
    active: ["payment"],
    completed: ["invoice-created"],
  },
  "invoice-created": {
    active: ["invoice-created"],
    completed: [],
  },
};

export function CreateIncomingSteppers(props: CreateIncomingSteppersProps) {
  const stepperState = useMemo(() => {
    return (stepper: Stepper): State => {
      if (STEPPER_STATE[stepper].completed.includes(props.currentStep)) return "completed";
      if (STEPPER_STATE[stepper].active.includes(props.currentStep)) return "active";
      return "default";
    };
  }, [props.currentStep]);

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
          state={stepperState("payment")}
        />

        <CreateInvoiceStepper
          title="Selesai"
          description="Faktur telah dibuat"
          iconPath={{
            default: "/assets/images/check-circle-icon-neutral-400-w16-h16.svg",
            active: "/assets/images/check-circle-icon-primary-300-w16-h16.svg",
          }}
          state={stepperState("invoice-created")}
        />
      </div>
    </div>
  );
}
