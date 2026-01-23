"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  CreateIncomingInvoiceContextProps,
  CreateIncomingInvoiceProviderProps,
  InvoiceDocument,
  SelectedPaymentOption,
} from "@/features/invoice/presentations/providers/create-incoming-invoice.types";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { isNonEmptyString, isValidDateTime, isValidFile } from "@/core/utilities/validation-patterns";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/hooks/use-create-incoming-invoice";

const INITIAL_INVOICE_DOCUMENT = { amount: 0, invoiceDate: DateTime.now(), dueDate: DateTime.now().plus({ days: 7 }) };
const MAX_INVOICE_DOCUMENTS = 5;

const CreateIncomingInvoiceContext = createContext<CreateIncomingInvoiceContextProps>({
  invoices: [INITIAL_INVOICE_DOCUMENT],
  canAddInvoiceDocument: true,
  isClean: false,
  isRecipientStepClean: false,
  isInvoiceStepClean: false,
  isSelectBankAccountStepClean: false,
  isSelectPaymentMethodStepClean: false,
  isCreating: false,
});

export function CreateIncomingInvoiceProvider(props: CreateIncomingInvoiceProviderProps) {
  const { trigger, isMutating } = useCreateIncomingInvoice();
  const [recipient, setRecipient] = useState<PartnerEntity>();
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([INITIAL_INVOICE_DOCUMENT]);
  const [bankAccount, setBankAccount] = useState<BankAccountEntity>();
  const [paymentMethod, setPaymentMethod] = useState<SelectedPaymentOption>();

  const isSelectPaymentMethodStepClean = useMemo(() => !!paymentMethod, [paymentMethod]);

  const isRecipientStepClean = useMemo(() => !!recipient, [recipient]);

  const isSelectBankAccountStepClean = useMemo(() => !!bankAccount, [bankAccount]);

  const isInvoiceStepClean = useMemo(() => {
    return invoices.every((invoice) => {
      return (
        invoice.amount > 0 &&
        isNonEmptyString(invoice.invoiceNumber) &&
        isValidDateTime(invoice.invoiceDate) &&
        isValidDateTime(invoice.dueDate) &&
        invoice.dueDate >= invoice.invoiceDate &&
        isValidFile(invoice.file)
      );
    });
  }, [invoices]);

  const isClean = useMemo(() => {
    return isRecipientStepClean && isInvoiceStepClean && isSelectBankAccountStepClean && isSelectPaymentMethodStepClean;
  }, [isRecipientStepClean, isInvoiceStepClean, isSelectBankAccountStepClean, isSelectPaymentMethodStepClean]);

  const canAddInvoiceDocument = useMemo(() => {
    return invoices.length < MAX_INVOICE_DOCUMENTS;
  }, [invoices, MAX_INVOICE_DOCUMENTS]);

  const addInvoiceDocument = () => {
    setInvoices((prev) => {
      if (prev.length >= MAX_INVOICE_DOCUMENTS) return prev;
      return [...prev, INITIAL_INVOICE_DOCUMENT];
    });
  };

  const createInvoice = async () => {
    if (!isClean) throw new ServerError(ErrorCodes.INCOMPLETE_FORM);

    return trigger({
      recipient: recipient!,
      bankAccount: bankAccount!,
      invoices: invoices!.map((invoice) => {
        return {
          file: invoice.file!,
          invoiceNumber: invoice.invoiceNumber!,
          amount: invoice.amount!,
          dueDate: invoice.dueDate,
          invoiceDate: invoice.invoiceDate!,
          note: invoice.note,
        };
      }),
      paymentGateway: paymentMethod!.gateway,
      paymentScheme: paymentMethod!.scheme,
    });
  };

  return (
    <CreateIncomingInvoiceContext.Provider
      value={{
        recipient,
        invoices,
        bankAccount,
        paymentMethod,
        setPaymentMethod,
        setBankAccount,
        setInvoices,
        setRecipient,
        addInvoiceDocument,
        canAddInvoiceDocument,
        isClean,
        isRecipientStepClean,
        isInvoiceStepClean,
        isSelectBankAccountStepClean,
        isSelectPaymentMethodStepClean,
        createInvoice,
        isCreating: isMutating,
      }}
    >
      {props.children}
    </CreateIncomingInvoiceContext.Provider>
  );
}

export function useCreateIncomingInvoiceProvider() {
  const context = useContext(CreateIncomingInvoiceContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_HOOK_CALL);
  return context;
}
