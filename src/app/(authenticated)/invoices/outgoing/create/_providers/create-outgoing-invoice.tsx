"use client";

import React, { useMemo, useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { useListAccountBankAccout } from "@/features/bank/presentation/hooks/use-list-account-bank-account";
import { HasNoAccountErrorDialog } from "@/app/(authenticated)/invoices/outgoing/create/_components/has-no-account-error-dialog";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type OutgoingStep =
  | "select-recipient"
  | "select-recipient.create-new"
  | "invoice-details"
  | "invoice-details.add-item"
  | "invoice-details.edit-item"
  | "payment-configuration"
  | "review-and-send";

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
  currentStep: OutgoingStep;
  setCurrentStep?: React.Dispatch<React.SetStateAction<OutgoingStep>>;
  recipient?: PartnerEntity;
  invoiceNumber?: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItem[];
  note?: string;
  tnc?: string;
  signature?: File | null;
  paymentConfiguration: PaymentConfiguration[];
  isRecipientStepClean: boolean;
  isInvoiceDetailsStepClean: boolean;
  isPaymentConfigStepClean: boolean;
  editingItemIndex: number | null;
  setEditingItemIndex?: React.Dispatch<React.SetStateAction<number | null>>;
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
  deleteInvoiceItem?: (params: { index: number }) => void;
}

interface CreateOutgoingInvoiceProviderProps {
  children: React.ReactNode;
}

const CreateOutgoingInvoiceContext = React.createContext<CreateOutgoingInvoiceContextProps>({
  currentStep: "select-recipient",
  invoiceDate: DateTime.now().setZone("Asia/Jakarta"),
  dueDate: DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }),
  items: [],
  paymentConfiguration: [],
  isRecipientStepClean: false,
  isInvoiceDetailsStepClean: false,
  isPaymentConfigStepClean: false,
  editingItemIndex: null,
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
  const { error: bankAccountError, loading: bankAccountLoading } = useListAccountBankAccout();
  const hasBankAccount =
    !bankAccountLoading &&
    !(bankAccountError instanceof ServerError && bankAccountError.code === ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT.code);

  const [currentStep, setCurrentStep] = useState<OutgoingStep>("select-recipient");
  const [recipient, setRecipient] = useState<PartnerEntity>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta"));
  const [dueDate, setDueDate] = useState<DateTime>(DateTime.now().setZone("Asia/Jakarta").plus({ days: 7 }));
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [note, setNote] = useState<string>("");
  const [tnc, setTnc] = useState<string>("");
  const [signature, setSignature] = useState<File | null>(null);
  const [paymentConfiguration, setPaymentConfiguration] = useState<PaymentConfiguration[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const isRecipientStepClean = useMemo(() => {
    return !!recipient;
  }, [recipient]);

  const isInvoiceDetailsStepClean = useMemo(() => {
    if (!invoiceNumber) return false;
    if (invoiceDate.startOf("day") > dueDate.startOf("day")) return false;
    if (items.length === 0) return false;
    return true;
  }, [invoiceNumber, invoiceDate, dueDate, items]);

  const isPaymentConfigStepClean = useMemo(() => {
    return paymentConfiguration.length > 0;
  }, [paymentConfiguration]);

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

  const deleteInvoiceItem = (param: { index: number }) => {
    if (!setItems) return;
    setItems((prev) => prev.filter((_, index) => index !== param.index));
  };

  return (
    <CreateOutgoingInvoiceContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        recipient,
        invoiceNumber,
        invoiceDate,
        dueDate,
        items,
        note,
        tnc,
        paymentConfiguration,
        isRecipientStepClean,
        isInvoiceDetailsStepClean,
        isPaymentConfigStepClean,
        editingItemIndex,
        setEditingItemIndex,
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
        deleteInvoiceItem,
      }}
    >
      {!bankAccountLoading && !hasBankAccount && <HasNoAccountErrorDialog />}
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
