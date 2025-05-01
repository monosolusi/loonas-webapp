"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { DateTime } from "luxon";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";

export interface InvoiceDocument {
  file: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
}

interface CreateIncomingInvoiceContextProps {
  receiver?: PartnerEntity;
  bankAccount?: BankAccountEntity;
  invoiceDocuments: InvoiceDocument[];
  paymentGateway?: PaymentGatewayEntity;
  paymentScheme?: PaymentSchemeEntity;
  setReceiver?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  setBankAccount?: React.Dispatch<React.SetStateAction<BankAccountEntity | undefined>>;
  setPaymentGateway?: React.Dispatch<React.SetStateAction<PaymentGatewayEntity | undefined>>;
  setPaymentScheme?: React.Dispatch<React.SetStateAction<PaymentSchemeEntity | undefined>>;
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
  const [paymentGateway, setPaymentGateway] = useState<PaymentGatewayEntity>();
  const [paymentScheme, setPaymentScheme] = useState<PaymentSchemeEntity>();

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
        paymentGateway,
        paymentScheme,
        setReceiver,
        setBankAccount,
        setPaymentGateway,
        setPaymentScheme,
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