"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";

export enum TaxType {
  INCLUSIVE = "INCLUSIVE",
  EXCLUSIVE = "EXCLUSIVE",
  NON_TAXABLE = "NON_TAXABLE",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
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
  dueDate: DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 })
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

  const addInvoiceItem = (item: AddInvoiceItemParams) => {
    if (!setItems) return;

    setItems((prev) => {
      const calculateBase = (params: {
        price: number,
        qty: number,
        discountType?: DiscountType,
        discount?: number
      }): number => {
        if (!params.discountType || !params.discount) return params.price * params.qty;
        if (params.discountType === DiscountType.PERCENTAGE) {
          return params.price * params.qty * (100 - params.discount) / 100;
        } else if (params.discountType === DiscountType.FIXED) {
          return params.price * params.qty - params.discount;
        } else return params.price * params.qty;
      };

      const calculateTaxBase = (params: {
        base: number,
        taxType?: TaxType,
        tax?: number
      }): number => {
        if (!params.taxType || !params.tax) return 0; // This is the case where it is not taxable
        if (params.taxType === TaxType.EXCLUSIVE) return params.base;
        else if (params.taxType === TaxType.INCLUSIVE) return params.base - params.tax;
        else return 0;
      };

      const calculateTotal = (params: { taxType: TaxType, base: number, taxBase: number, tax: number }) => {
        if (params.taxType === TaxType.NON_TAXABLE) return params.base;
        else return params.taxBase + params.tax;
      };

      const base = calculateBase(item);
      const taxBase = calculateTaxBase({ base, taxType: item.taxType, tax: item.tax });
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
        total: calculateTotal({ taxType: item.taxType, base, taxBase, tax: item.tax })
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
        addInvoiceItem
      }}
    >
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
