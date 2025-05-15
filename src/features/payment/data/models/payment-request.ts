import { PartnerModel } from "@/features/partner/data/models/partner";
import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";
import { DateTime } from "luxon";
import { BankAccountModel } from "@/features/bank/data/models/bank-account";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { AbstractModel } from "@/core/resources/model";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";
import { InvoiceSummaryDocumentModel } from "@/features/invoice/data/models/invoice-summary-document";

interface PaymentRequestModelConstructor {
  id: string;
  receiver: PartnerModel;
  bankAccount: BankAccountModel;
  invoices: InvoiceSummaryDocumentModel[];
  paymentMethod: PaymentGatewayModel;
  paymentScheme?: PaymentSchemeModel;
  status: PaymentRequestStatus;
  total: number;
  totalFee: number;
  totalToBePaid: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PaymentRequestModel implements AbstractModel {
  public id: string;
  public receiver: PartnerModel;
  public bankAccount: BankAccountModel;
  public invoices: InvoiceSummaryDocumentModel[];
  public paymentMethod: PaymentGatewayModel;
  public paymentScheme?: PaymentSchemeModel;
  public status: PaymentRequestStatus;
  public total: number;
  public totalFee: number;
  public totalToBePaid: number;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: PaymentRequestModelConstructor) {
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

  static fromJson(json: Record<string, any>, others: {
    receiver: PartnerModel,
    bankAccount: BankAccountModel,
    paymentMethod: PaymentGatewayModel,
    paymentScheme?: PaymentSchemeModel
  }): PaymentRequestModel {
    return new PaymentRequestModel({
      id: json.id,
      receiver: others.receiver,
      bankAccount: others.bankAccount,
      invoices: json.invoices.map((invoice: any) => InvoiceSummaryDocumentModel.fromJson(invoice)),
      paymentMethod: others.paymentMethod,
      paymentScheme: others.paymentScheme,
      status: json.status,
      total: json.total,
      totalFee: json.total_fee,
      totalToBePaid: json.total_to_be_paid,
      createdAt: DateTime.fromISO(json.created_at),
      updatedAt: DateTime.fromISO(json.updated_at),
      deletedAt: json.deleted_at ? DateTime.fromISO(json.deleted_at) : undefined
    });
  }

  toEntity(): PaymentRequestEntity {
    return new PaymentRequestEntity({
      id: this.id,
      receiver: this.receiver.toEntity(),
      bankAccount: this.bankAccount.toEntity(),
      invoices: this.invoices.map(invoice => invoice.toEntity()),
      paymentMethod: this.paymentMethod.toEntity(),
      paymentScheme: this.paymentScheme?.toEntity(),
      status: this.status,
      total: this.total,
      totalFee: this.totalFee,
      totalToBePaid: this.totalToBePaid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    });
  }
}