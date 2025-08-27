"use client";

import React, { useEffect, useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { DateTime } from "luxon";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import {
  CreatePaymentRequestUseCase,
  CreatePaymentRequestUseCaseParams,
} from "@/features/payment/domain/usecases/create-payment-request";
import { PaymentRequestRepositoryImpl } from "@/features/payment/data/repositories/payment-request";
import { PaymentRequestServiceImpl } from "@/features/payment/data/sources/payment-request";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { PaymentGatewayServiceImpl } from "@/features/payment/data/sources/payment-gateway";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import {
  UploadPaymentRequestInvoicesUseCase,
  UploadPaymentRequestInvoicesUseCaseParams,
} from "@/features/payment/domain/usecases/upload-payment-request-invoices";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";
import { HttpRequest } from "@/core/helpers/http-request";

export interface InvoiceDocument {
  file: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
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
  createPaymentRequest?: () => Promise<PaymentRequestEntity>;
}

const CreateIncomingInvoiceContext = React.createContext<CreateIncomingInvoiceContextProps>({
  invoiceDocuments: [],
});

export function CreateIncomingInvoiceProvider({ children }: { children: React.ReactNode }) {
  const [receiver, setReceiver] = useState<PartnerEntity>();
  const [bankAccount, setBankAccount] = useState<BankAccountEntity>();
  const [invoiceDocuments, setInvoiceDocuments] = useState<InvoiceDocument[]>([]);
  const [paymentGateway, setPaymentGateway] = useState<PaymentGatewayEntity>();
  const [paymentScheme, setPaymentScheme] = useState<PaymentSchemeEntity>();

  useEffect(() => {
    // When invoiceDocuments change, we will set the PaymentGateway and PaymentScheme to undefined
    setPaymentGateway(undefined);
    setPaymentScheme(undefined);
  }, [invoiceDocuments]);

  const addInvoiceDocument = (document: InvoiceDocument) => {
    // Check the invoiceDate should not be greater than dueDate
    if (document.invoiceDate > document.dueDate) throw new ServerError(ErrorCodes.INVALID_INVOICE_DATE);
    setInvoiceDocuments((prev) => [...prev, document]);
  };

  const removeInvoiceDocument = (index: number) => {
    setInvoiceDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const createPaymentRequest = async () => {
    try {
      // Check if all the field conditions are satisfied
      if (!receiver) throw new ServerError(ErrorCodes.EMPTY_RECEIVER);
      if (!bankAccount) throw new ServerError(ErrorCodes.EMPTY_BANK_ACCOUNT);
      if (!invoiceDocuments) throw new ServerError(ErrorCodes.EMPTY_INVOICES);
      if (!paymentGateway) throw new ServerError(ErrorCodes.EMPTY_PAYMENT_METHOD);
      if (paymentGateway.requiresSchemeSelection && !paymentScheme)
        throw new ServerError(ErrorCodes.EMPTY_PAYMENT_SCHEME);

      const http = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const partnerService = new PartnerServiceImpl(http);
      const bankService = new BankServiceImpl();
      const paymentGatewayService = new PaymentGatewayServiceImpl();
      const paymentRequestService = new PaymentRequestServiceImpl(partnerService, bankService, paymentGatewayService);
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const paymentRequestRepository = new PaymentRequestRepositoryImpl(paymentRequestService);
      const create = new CreatePaymentRequestUseCase(paymentRequestRepository, sessionRepository);
      const createParams = new CreatePaymentRequestUseCaseParams({
        receiver: receiver,
        bankAccount: bankAccount,
        invoices: invoiceDocuments,
        paymentMethod: paymentGateway,
        paymentScheme: paymentScheme,
      });

      const result = await create.execute(createParams);
      if (result instanceof DataFailed) throw result.error;
      if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Upload the invoice documents given the PaymentRequestId
      const upload = new UploadPaymentRequestInvoicesUseCase(paymentRequestRepository, sessionRepository);
      const uploadParams = new UploadPaymentRequestInvoicesUseCaseParams({
        paymentRequest: result.data,
        invoices: invoiceDocuments,
      });

      const uploadResult = await upload.execute(uploadParams);
      if (uploadResult instanceof DataFailed) throw uploadResult.error;
      return result.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
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
        removeInvoiceDocument,
        createPaymentRequest,
      }}
    >
      {children}
    </CreateIncomingInvoiceContext.Provider>
  );
}

export function useCreateIncomingInvoice() {
  return React.useContext(CreateIncomingInvoiceContext);
}
