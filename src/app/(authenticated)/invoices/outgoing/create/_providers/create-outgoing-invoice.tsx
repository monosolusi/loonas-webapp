"use client";

import React, { useState } from "react";

interface CreateOutgoingInvoiceContextProps {
  currentStep: number;
  nextStep?: () => void;
  previousStep?: () => void;
}

interface CreateOutgoingInvoiceProviderProps {
  children: React.ReactNode;
  maxStep: number;
}

const CreateOutgoingInvoiceContext = React.createContext<CreateOutgoingInvoiceContextProps>({
  currentStep: 0
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => {
      if (prev < (props.maxStep - 1)) return prev + 1;
      return prev;
    });
  };

  const previousStep = () => {
    setCurrentStep((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  };

  return (
    <CreateOutgoingInvoiceContext.Provider
      value={{ currentStep, nextStep, previousStep }}
    >
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
