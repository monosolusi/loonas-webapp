"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { TaxCalculator } from "@/core/utilities/tax/domain/calculator";
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

export interface AddInvoiceItemParams {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  tax: number;
  discountType?: DiscountType;
  discount?: number;
}

interface CreateOutgoingInvoiceContextProps {
  currentStep: number;
  nextStep?: () => void;
  previousStep?: () => void;
  recipient?: PartnerEntity;
  invoiceNumber?: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items?: InvoiceItem[];
  setItems?: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  setDueDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceNumber?: React.Dispatch<React.SetStateAction<string>>;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  addInvoiceItem?: (item: AddInvoiceItemParams) => void;
}

interface CreateOutgoingInvoiceProviderProps {
  children: React.ReactNode;
  maxStep: number;
}

const CreateOutgoingInvoiceContext = React.createContext<CreateOutgoingInvoiceContextProps>({
  currentStep: 0,
  invoiceDate: DateTime.now().setZone("Asia/Jakarta"),
  dueDate: DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }),
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipient, setRecipient] = useState<PartnerEntity>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta"));
  const [dueDate, setDueDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }));
  const [items, setItems] = useState<InvoiceItem[]>([]);

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

  const addInvoiceItem = (item: AddInvoiceItemParams) => {
    if (!setItems) return;

    setItems((prev) => {
      const base = TaxCalculator.calculateAmountBeforeTax(item);
      const taxBase = TaxCalculator.calculateTaxBase({ base, taxType: item.taxType, tax: item.tax });
      const newItem: InvoiceItem = {
        name: item.name,
        description: item.description,
        qty: item.qty,
        price: item.price,
        taxType: item.taxType,
        tax: item.tax,
        taxBase: taxBase,
        discountType: item.discountType,
        discount: item.discount,
        total: TaxCalculator.calculateTotalWithTax({ taxType: item.taxType, base, taxBase, tax: item.tax }),
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
