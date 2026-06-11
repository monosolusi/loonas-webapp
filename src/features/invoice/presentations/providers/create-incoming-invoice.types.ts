import React from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";

export type SelectedPaymentOption = {
  gateway: PaymentGatewayEntity;
  scheme?: PaymentSchemeEntity;
  display: { feeInString: string; feeInNumber: number };
};

export type InvoiceDocument = {
  file?: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
};

export type CreateIncomingInvoiceContextProps = {
  recipient?: PartnerEntity;
  invoices: InvoiceDocument[];
  bankAccount?: BankAccountEntity;
  paymentMethod?: SelectedPaymentOption;
  setPaymentMethod?: React.Dispatch<React.SetStateAction<SelectedPaymentOption | undefined>>;
  setBankAccount?: React.Dispatch<React.SetStateAction<BankAccountEntity | undefined>>;
  setInvoices?: React.Dispatch<React.SetStateAction<InvoiceDocument[]>>;
  setRecipient?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  addInvoiceDocument?: () => void;
  canAddInvoiceDocument: boolean;
  isClean: boolean;
  isRecipientStepClean: boolean;
  isInvoiceStepClean: boolean;
  isSelectBankAccountStepClean: boolean;
  isSelectPaymentMethodStepClean: boolean;
  createInvoice?: () => Promise<PaymentRequestEntity>;
  isCreating: boolean;
};

export type CreateIncomingInvoiceProviderProps = {
  children: React.ReactNode;
};
