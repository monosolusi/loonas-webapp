import { PartnerModel } from "@/features/partner/data/models/partner";
import { DateTime } from "luxon";
import { InvoiceEntity, InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { BankAccountModel } from "@/features/bank/data/models/bank-account";
import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { AbstractModel } from "@/core/resources/model";
import { InvoiceSummaryDocumentModel } from "@/features/invoice/data/models/invoice-summary-document";

interface InvoiceModelConstructor {
  id: string;
  receiver: PartnerModel;
  bankAccount: BankAccountModel;
  amount: number;
  fee: number;
  total: number;
  paymentMethod: PaymentGatewayModel;
  status: InvoiceStatus;
  type: InvoiceType;
  documents?: InvoiceSummaryDocumentModel[];
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class InvoiceModel implements AbstractModel {
  public id: string;
  public receiver: PartnerModel;
  public bankAccount: BankAccountModel;
  public amount: number;
  public fee: number;
  public total: number;
  public paymentMethod: PaymentGatewayModel;
  public status: InvoiceStatus;
  public type: InvoiceType;
  public documents?: InvoiceSummaryDocumentModel[];
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: InvoiceModelConstructor) {
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

  public static fromJson(doc: Record<string, any>): InvoiceModel {
    return new InvoiceModel({
      id: doc["id"],
      receiver: PartnerModel.fromJson(doc["receiver"]),
      bankAccount: BankAccountModel.fromJson(doc["bank_account"]),
      amount: Number(doc["amount"]),
      fee: Number(doc["fee"]),
      total: Number(doc["total"]),
      paymentMethod: PaymentGatewayModel.fromJson(doc["payment_method"]),
      status: doc["status"],
      type: doc["type"],
      documents: doc["documents"]?.map((doc: Record<string, any>) => InvoiceSummaryDocumentModel.fromJson(doc)),
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined,
    });
  }

  toEntity(): InvoiceEntity {
    return new InvoiceEntity({
      id: this.id,
      receiver: this.receiver.toEntity(),
      bankAccount: this.bankAccount.toEntity(),
      amount: this.amount,
      fee: this.fee,
      total: this.total,
      paymentMethod: this.paymentMethod.toEntity(),
      status: this.status,
      type: this.type,
      documents: this.documents?.map((doc) => doc.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
