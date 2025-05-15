import { DataState } from "@/core/resources/data-state";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { DateTime } from "luxon";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface InvoiceDocument {
  file: File;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
}

export interface PaymentRequestRepositoryCreateParams {
  receiver: PartnerEntity;
  bankAccount: BankAccountEntity;
  invoices: InvoiceDocument[];
  paymentMethod: PaymentGatewayEntity;
  paymentScheme?: PaymentSchemeEntity;
}

export interface PaymentRequestRepositoryUploadInvoicesParams {
  paymentRequest: PaymentRequestEntity;
  invoices: InvoiceDocument[];
}

export interface PaymentRequestRepositoryGetParams {
  id: string;
  includes?: string;
}

export abstract class PaymentRequestRepository {
  public abstract create(params: PaymentRequestRepositoryCreateParams, session: SessionEntity): Promise<DataState<PaymentRequestEntity>>

  public abstract uploadInvoices(params: PaymentRequestRepositoryUploadInvoicesParams, session: SessionEntity): Promise<DataState<boolean>>

  public abstract get(params: PaymentRequestRepositoryGetParams, session: SessionEntity): Promise<DataState<PaymentRequestEntity>>

}