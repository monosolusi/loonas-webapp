"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";

interface CreateOutgoingInvoiceContextProps {
  currentStep: number;
  nextStep?: () => void;
  previousStep?: () => void;
  recipient?: PartnerEntity;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
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
  const [recipient, setRecipient] = useState<PartnerEntity>();

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
      value={{
        currentStep,
        nextStep,
        previousStep,
        recipient,
        setRecipient
      }}
    >
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
