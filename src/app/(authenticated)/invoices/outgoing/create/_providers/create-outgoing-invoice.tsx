"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

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

// Seed used to re-hydrate the payment step when editing a draft. The invoice's payment_method
// snapshot does not expose the original gateway id, so the enabled/fee state is matched back to
// the live gateway list by title (best-effort); the submitted ids always come from the live list.
export interface EditPaymentConfigSeed {
  title: string;
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
  editingInvoiceId?: string;
  isEditMode: boolean;
  editInitialPaymentConfig: EditPaymentConfigSeed[];
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
  setEditingInvoiceId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditInitialPaymentConfig?: React.Dispatch<React.SetStateAction<EditPaymentConfigSeed[]>>;
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
  isEditMode: false,
  editInitialPaymentConfig: [],
});

export function CreateOutgoingInvoiceProvider(props: CreateOutgoingInvoiceProviderProps) {
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
  const [editingInvoiceId, setEditingInvoiceId] = useState<string>();
  const [editInitialPaymentConfig, setEditInitialPaymentConfig] = useState<EditPaymentConfigSeed[]>([]);

  const isEditMode = !!editingInvoiceId;

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
        editingInvoiceId,
        isEditMode,
        editInitialPaymentConfig,
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
        setEditingInvoiceId,
        setEditInitialPaymentConfig,
        addInvoiceItem,
        updateInvoiceItem,
        deleteInvoiceItem,
      }}
    >
      <Suspense fallback={null}>
        <DraftPrefill />
      </Suspense>
      {props.children}
    </CreateOutgoingInvoiceContext.Provider>
  );
}

// Reads `?draftId` and, when present, switches the wizard into edit mode and prefills it from the
// draft. Rendered inside the provider so it can populate the context. Wrapped in Suspense by the
// provider because it uses useSearchParams().
function DraftPrefill() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId") ?? undefined;
  const { setEditingInvoiceId } = useCreateOutgoingInvoice();

  useEffect(() => {
    setEditingInvoiceId?.(draftId);
  }, [draftId, setEditingInvoiceId]);

  if (!draftId) return null;
  return <DraftPrefillInner draftId={draftId} />;
}

function DraftPrefillInner({ draftId }: { draftId: string }) {
  const { invoice, loading } = useGetInvoice({ id: draftId });
  const {
    setRecipient,
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setItems,
    setNote,
    setTnc,
    setEditInitialPaymentConfig,
  } = useCreateOutgoingInvoice();
  const prefilled = useRef(false);

  useEffect(() => {
    if (prefilled.current || loading || !invoice || !(invoice instanceof OutgoingInvoiceEntity)) return;
    prefilled.current = true;

    const now = DateTime.now().setZone("Asia/Jakarta");
    const recipient = invoice.recipient;
    setRecipient?.(
      new PartnerEntity(
        recipient.originalId ?? recipient.id,
        recipient.fullName,
        recipient.email ?? "",
        recipient.phoneNumber ?? "",
        now,
        now,
      ),
    );
    setInvoiceNumber?.(invoice.invoiceNumber);
    setInvoiceDate?.(invoice.invoiceDate);
    setDueDate?.(invoice.dueDate);
    setItems?.(
      invoice.items.map((item) => ({
        name: item.name,
        description: item.description,
        qty: item.qty,
        price: item.price,
        taxType: item.taxType,
        tax: item.tax,
        taxBase: item.taxBase,
        discountType: item.discountType ?? DiscountType.NO_DISCOUNT,
        discount: item.discount ?? 0,
        total: item.total,
      })),
    );
    setNote?.(invoice.note ?? "");
    setTnc?.(invoice.tnc ?? "");
    setEditInitialPaymentConfig?.(
      invoice.paymentConfiguration.map((config) => ({
        title: config.paymentMethod.title,
        isEnabled: config.isEnabled,
        chargeFeeOn: config.chargeFeeOn,
      })),
    );
  }, [
    invoice,
    loading,
    setRecipient,
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setItems,
    setNote,
    setTnc,
    setEditInitialPaymentConfig,
  ]);

  return null;
}

export function useCreateOutgoingInvoice() {
  return React.useContext(CreateOutgoingInvoiceContext);
}
