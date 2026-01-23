import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { DateTime } from "luxon";
import { useClerk } from "@clerk/nextjs";

type InvoiceDocument = {
  file: File;
  invoiceNumber: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
};

export type CreateIncomingInvoiceFetcherTrigger = {
  recipient: PartnerEntity;
  bankAccount: BankAccountEntity;
  invoices: InvoiceDocument[];
  paymentGateway: PaymentGatewayEntity;
  paymentScheme?: PaymentSchemeEntity;
};

export type CreateIncomingInvoiceFetcherParams = CreateIncomingInvoiceFetcherTrigger & {
  clerk: ReturnType<typeof useClerk>;
};
