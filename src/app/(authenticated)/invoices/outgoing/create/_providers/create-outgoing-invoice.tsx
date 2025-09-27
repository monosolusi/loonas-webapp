"use client";

import React, { useEffect, useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { useListPaymentMethod } from "@/features/payment/presentations/hooks/use-list-payment-method";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

export interface InvoiceItem {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  tax: number;
  taxBase: number;
  discountType: DiscountType;
  discount: number;
  total: number;
}

interface PaymentConfiguration {
  paymentMethod: PaymentGatewayEntity;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
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
  paymentConfiguration: PaymentConfiguration[];
  setPaymentConfiguration?: React.Dispatch<React.SetStateAction<PaymentConfiguration[]>>;
  setSignature?: React.Dispatch<React.SetStateAction<File | null>>;
  setTnc?: React.Dispatch<React.SetStateAction<string>>;
  setNote?: React.Dispatch<React.SetStateAction<string>>;
  setItems?: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  setDueDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceDate?: React.Dispatch<React.SetStateAction<DateTime>>;
  setInvoiceNumber?: React.Dispatch<React.SetStateAction<string>>;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  addInvoiceItem?: (item: InvoiceItem) => void;
  updateInvoiceItem?: (params: { index: number; newData: InvoiceItem }) => void;
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
  paymentConfiguration: [],
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
  const { paymentMethods } = useListPaymentMethod();

  const [currentStep, setCurrentStep] = useState(0);
  const [recipient, setRecipient] = useState<PartnerEntity>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta"));
  const [dueDate, setDueDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }));
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [note, setNote] = useState<string>("");
  const [tnc, setTnc] = useState<string>("");
  const [signature, setSignature] = useState<File | null>(null);
  const [paymentConfiguration, setPaymentConfiguration] = useState<PaymentConfiguration[]>([]);

  useEffect(() => {
    if (!paymentMethods) return;
    const paymentConfiguration = paymentMethods.map((paymentMethod) => ({
      paymentMethod: paymentMethod,
      isEnabled: true,
      chargeFeeOn: ChargeFeeOn.INVOICE_RECEIVER,
    }));

    setPaymentConfiguration(paymentConfiguration);
  }, [paymentMethods]);

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

  const updateInvoiceItem = (params: { index: number; newData: InvoiceItem }) => {
    if (!setItems) return;

    setItems((prev) => {
      return prev.map((item, index) => {
        if (index === params.index) return params.newData;
        return item;
      });
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
        paymentConfiguration,
        setPaymentConfiguration,
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
        updateInvoiceItem,
      }}
    >
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
