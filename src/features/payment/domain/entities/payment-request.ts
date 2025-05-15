import { DateTime } from "luxon";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { AbstractEntity } from "@/core/resources/entity";
import { InvoiceSummaryDocumentEntity } from "@/features/invoice/domain/entities/invoice-summary-document";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";

interface PaymentRequestEntityConstructor {
  id: string;
  receiver: PartnerEntity;
  bankAccount: BankAccountEntity;
  invoices: InvoiceSummaryDocumentEntity[];
  paymentMethod: PaymentGatewayEntity;
  paymentScheme?: PaymentSchemeEntity;
  status: PaymentRequestStatus;
  total: number;
  totalFee: number;
  totalToBePaid: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PaymentRequestEntity implements AbstractEntity {
  public id: string;
  public receiver: PartnerEntity;
  public bankAccount: BankAccountEntity;
  public invoices: InvoiceSummaryDocumentEntity[];
  public paymentMethod: PaymentGatewayEntity;
  public paymentScheme?: PaymentSchemeEntity;
  public status: PaymentRequestStatus;
  public total: number;
  public totalFee: number;
  public totalToBePaid: number;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: PaymentRequestEntityConstructor) {
    this.id = args.id;
    this.receiver = args.receiver;
    this.bankAccount = args.bankAccount;
    this.invoices = args.invoices;
    this.paymentMethod = args.paymentMethod;
    this.paymentScheme = args.paymentScheme;
    this.status = args.status;
    this.total = args.total;
    this.totalFee = args.totalFee;
    this.totalToBePaid = args.totalToBePaid;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}