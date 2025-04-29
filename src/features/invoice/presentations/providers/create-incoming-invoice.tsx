"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";

export interface InvoiceDocument {
  file: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: string;
}

interface CreateIncomingInvoiceContextProps {
  receiver?: PartnerEntity;
  bankAccount?: BankAccountEntity;
  invoiceDocuments: InvoiceDocument[];
  setReceiver?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  setBankAccount?: React.Dispatch<React.SetStateAction<BankAccountEntity | undefined>>;
  addInvoiceDocument?: (document: InvoiceDocument) => void;
  removeInvoiceDocument?: (index: number) => void;
}

const CreateIncomingInvoiceContext = React.createContext<CreateIncomingInvoiceContextProps>({
  invoiceDocuments: []
});

export function CreateIncomingInvoiceProvider({ children }: { children: React.ReactNode }) {
  const [receiver, setReceiver] = useState<PartnerEntity>();
  const [bankAccount, setBankAccount] = useState<BankAccountEntity>();
  const [invoiceDocuments, setInvoiceDocuments] = useState<InvoiceDocument[]>([]);

  const addInvoiceDocument = (document: InvoiceDocument) => {
    setInvoiceDocuments(prev => [...prev, document]);
  };

  const removeInvoiceDocument = (index: number) => {
    setInvoiceDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <CreateIncomingInvoiceContext.Provider
      value={{
        receiver,
        bankAccount,
        invoiceDocuments,
        setReceiver,
        setBankAccount,
        addInvoiceDocument,
        removeInvoiceDocument
      }}
    >
      {children}
    </CreateIncomingInvoiceContext.Provider>
  );
}

export function useCreateIncomingInvoice() {
  return React.useContext(CreateIncomingInvoiceContext);
}