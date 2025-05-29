"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { TaxType } from "@/features/tax/domain/enums/tax-type";

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
  NO_DISCOUNT = "NO_DISCOUNT",
}

export interface InvoiceItem {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  tax: number;
  taxBase: number;
  discountType?: DiscountType;
  discount?: number;
  total: number;
}

interface CreateOutgoingInvoiceContextProps {
  currentStep: number;
  nextStep?: () => void;
  previousStep?: () => void;
  recipient?: PartnerEntity;
  invoiceNumber?: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItem[];
  note?: string;
  tnc?: string;
  signature?: File | null;
  setSignature?: React.Dispatch<React.SetStateAction<File | null>>;
  setTnc?: React.Dispatch<React.SetStateAction<string>>;
  setNote?: React.Dispatch<React.SetStateAction<string>>;
  setItems?: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  setDueDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceNumber?: React.Dispatch<React.SetStateAction<string>>;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  addInvoiceItem?: (item: InvoiceItem) => void;
}

interface CreateOutgoingInvoiceProviderProps {
  children: React.ReactNode;
  maxStep: number;
}

const CreateOutgoingInvoiceContext = React.createContext<CreateOutgoingInvoiceContextProps>({
  currentStep: 0,
  invoiceDate: DateTime.now().setZone("Asia/Jakarta"),
  dueDate: DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }),
  items: [],
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipient, setRecipient] = useState<PartnerEntity>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta"));
  const [dueDate, setDueDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }));
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [note, setNote] = useState<string>("");
  const [tnc, setTnc] = useState<string>("");
  const [signature, setSignature] = useState<File | null>(null);

  const nextStep = () => {
    setCurrentStep((prev) => {
      if (prev < props.maxStep - 1) return prev + 1;
      return prev;
    });
  };

  const previousStep = () => {
    setCurrentStep((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  };

  const addInvoiceItem = (item: InvoiceItem) => {
    if (!setItems) return;

    setItems((prev) => {
      const newItem: InvoiceItem = {
        name: item.name,
        description: item.description,
        qty: item.qty,
        price: item.price,
        taxType: item.taxType,
        tax: item.tax,
        taxBase: item.taxBase,
        discountType: item.discountType,
        discount: item.discount,
        total: item.total,
      };

      return [...prev, newItem];
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
        items,
        note,
        tnc,
        signature,
        setSignature,
        setTnc,
        setNote,
        setItems,
        setDueDate,
        setInvoiceDate,
        setInvoiceNumber,
        setRecipient,
        addInvoiceItem,
      }}
    >
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
