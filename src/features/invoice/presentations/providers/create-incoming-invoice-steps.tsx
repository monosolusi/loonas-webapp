// "use client";
//
// import React, { useEffect, useState } from "react";
//
// type StepStatus = "current" | "upcoming" | "completed";
//
// interface CreateIncomingInvoiceStepsContextProps {
//   currentStep: number;
//   steps: { id: number; name: string; status: StepStatus }[];
//   nextStep?: () => void;
//   prevStep?: () => void;
// }
//
// const CreateIncomingInvoiceStepsContext = React.createContext<CreateIncomingInvoiceStepsContextProps>({
//   currentStep: 1,
//   steps: [],
// });
//
// export function CreateIncomingInvoiceStepsProvider({ children }: { children: React.ReactNode }) {
//   const [steps, setSteps] = useState([
//     { id: 1, name: "Pilih Penerima", status: "current" as StepStatus },
//     { id: 2, name: "Pilih Rekening Tujuan", status: "upcoming" as StepStatus },
//     { id: 3, name: "Upload Faktur", status: "upcoming" as StepStatus },
//     { id: 4, name: "Pilih Metode Pembayaran", status: "upcoming" as StepStatus },
//   ]);
//
//   const maxSteps = steps.length;
//   const [currentStep, setCurrentStep] = useState<number>(1);
//
//   useEffect(() => {
//     setSteps(
//       steps.map((step) => ({
//         ...step,
//         status: step.id === currentStep ? "current" : step.id < currentStep ? "completed" : "upcoming",
//       })),
//     );
//   }, [currentStep]);
//
//   function nextStep() {
//     setCurrentStep((currentStep) => (currentStep === maxSteps ? currentStep : currentStep + 1));
//   }
//
//   function prevStep() {
//     setCurrentStep((currentStep) => (currentStep === 1 ? currentStep : currentStep - 1));
//   }
//
//   return (
//     <CreateIncomingInvoiceStepsContext.Provider value={{ currentStep, steps, nextStep, prevStep }}>
//       {children}
//     </CreateIncomingInvoiceStepsContext.Provider>
//   );
// }
//
// export function useCreateIncomingInvoiceSteps() {
//   return React.useContext(CreateIncomingInvoiceStepsContext);
// }

"use client";

import React, { useState } from "react";
import {
  CreateIncomingInvoiceStepsContextProps,
  CreateIncomingInvoiceStepsProviderProps,
  Step,
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";

export const STEP_MAP: Record<Step, { next: Step | null; prev: Step | null }> = {
  ["select-client"]: { next: "invoices", prev: null },
  ["select-client.create-new"]: { next: null, prev: null },
  ["invoices"]: { next: "client-bank-account", prev: "select-client" },
  ["client-bank-account"]: { next: "select-payment-method", prev: "invoices" },
  ["client-bank-account.create-new"]: { next: null, prev: null },
  ["select-payment-method"]: { next: "payment", prev: "client-bank-account" },
  ["payment"]: { next: "invoice-created", prev: "select-payment-method" },
  ["invoice-created"]: { next: null, prev: null },
};

const CreateIncomingInvoiceStepsContext = React.createContext<CreateIncomingInvoiceStepsContextProps>({
  currentStep: "select-client",
});

export function CreateIncomingInvoiceStepsProvider(props: CreateIncomingInvoiceStepsProviderProps) {
  const [currentStep, setCurrentStep] = useState<Step>("select-client");

  return (
    <CreateIncomingInvoiceStepsContext value={{ currentStep, setCurrentStep }}>
      {props.children}
    </CreateIncomingInvoiceStepsContext>
  );
}

export function useCreateIncomingInvoiceSteps() {
  return React.useContext(CreateIncomingInvoiceStepsContext);
}
