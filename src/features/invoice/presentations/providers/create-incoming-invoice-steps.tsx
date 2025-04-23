"use client";

import React, { useEffect, useState } from "react";

type StepStatus = "current" | "upcoming" | "completed";

interface CreateIncomingInvoiceStepsContextProps {
  currentStep: number,
  steps: { id: number, name: string, status: StepStatus }[],
  nextStep?: () => void,
  prevStep?: () => void,
}

const CreateIncomingInvoiceStepsContext = React.createContext<CreateIncomingInvoiceStepsContextProps>({
  currentStep: 1,
  steps: []
});

export function CreateIncomingInvoiceStepsProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState([
    { id: 1, name: "Pilih Penerima", status: "current" as StepStatus },
    { id: 2, name: "Pilih Rekening Tujuan", status: "upcoming" as StepStatus },
    { id: 3, name: "Upload Faktur", status: "upcoming" as StepStatus },
    { id: 4, name: "Pilih Metode Pembayaran", status: "upcoming" as StepStatus }
  ]);

  const maxSteps = steps.length;
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    setSteps(steps.map(step => ({
      ...step,
      status: step.id === currentStep ? "current" :
        step.id < currentStep ? "completed" :
          "upcoming"
    })));
  }, [currentStep]);

  function nextStep() {
    setCurrentStep((currentStep) => currentStep === maxSteps ? currentStep : currentStep + 1);
  }

  function prevStep() {
    setCurrentStep((currentStep) => currentStep === 1 ? currentStep : currentStep - 1);
  }


  return (
    <CreateIncomingInvoiceStepsContext.Provider
      value={{ currentStep, steps, nextStep, prevStep }}
    >
      {children}
    </CreateIncomingInvoiceStepsContext.Provider>
  );
}

export function useCreateIncomingInvoiceSteps() {
  return React.useContext(CreateIncomingInvoiceStepsContext);
}