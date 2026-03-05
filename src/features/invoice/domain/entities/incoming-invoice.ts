import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { InvoiceSummaryDocumentEntity } from "@/features/invoice/domain/entities/invoice-summary-document";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";

export type InvoiceStatus = PaymentRequestStatus | OutgoingInvoiceStatus;

interface IncomingInvoiceEntityConstructor {
  id: string;
  receiver: PartnerEntity;
  bankAccount: BankAccountEntity;
  amount: number;
  fee: number;
  total: number;
  paymentMethod: PaymentGatewayEntity;
  status: InvoiceStatus;
  type: InvoiceType;
  documents?: InvoiceSummaryDocumentEntity[];
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class IncomingInvoiceEntity implements AbstractEntity {
  public id: string;
  public receiver: PartnerEntity;
  public bankAccount: BankAccountEntity;
  public amount: number;
  public fee: number;
  public total: number;
  public paymentMethod: PaymentGatewayEntity;
  public status: InvoiceStatus;
  public type: InvoiceType;
  public documents?: InvoiceSummaryDocumentEntity[];
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: IncomingInvoiceEntityConstructor) {
    this.id = args.id;
    this.receiver = args.receiver;
    this.bankAccount = args.bankAccount;
    this.amount = args.amount;
    this.fee = args.fee;
    this.total = args.total;
    this.paymentMethod = args.paymentMethod;
    this.status = args.status;
    this.type = args.type;
    this.documents = args.documents;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
