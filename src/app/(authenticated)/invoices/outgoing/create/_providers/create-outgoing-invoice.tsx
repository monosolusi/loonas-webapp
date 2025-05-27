"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";

interface CreateOutgoingInvoiceContextProps {
  currentStep: number;
  nextStep?: () => void;
  previousStep?: () => void;
  recipient?: PartnerEntity;
  invoiceNumber?: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  setDueDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceNumber?: React.Dispatch<React.SetStateAction<string>>;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
}

interface CreateOutgoingInvoiceProviderProps {
  children: React.ReactNode;
  maxStep: number;
}

const CreateOutgoingInvoiceContext = React.createContext<CreateOutgoingInvoiceContextProps>({
  currentStep: 0,
  invoiceDate: DateTime.now().setZone("Asia/Jakarta"),
  dueDate: DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 })
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipient, setRecipient] = useState<PartnerEntity>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta"));
  const [dueDate, setDueDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }));

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
        invoiceNumber,
        invoiceDate,
        dueDate,
        setDueDate,
        setInvoiceDate,
        setInvoiceNumber,
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
