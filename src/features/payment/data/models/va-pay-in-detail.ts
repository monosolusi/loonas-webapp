import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { DateTime } from "luxon";
import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";

interface VirtualAccountPayInDetailModelConstructor {
  id: string;
  accountNumber: string;
  recipientName: string;
  paymentScheme: PaymentSchemeModel;
  expirationTime: DateTime;
  amount: number;
  status: PayInStatus;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class VirtualAccountPayInDetailModel {
  public id: string;
  public accountNumber: string;
  public recipientName: string;
  public paymentScheme: PaymentSchemeModel;
  public expirationTime: DateTime;
  public amount: number;
  public status: PayInStatus;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: VirtualAccountPayInDetailModelConstructor) {
    this.id = args.id;
    this.accountNumber = args.accountNumber;
    this.recipientName = args.recipientName;
    this.paymentScheme = args.paymentScheme;
    this.expirationTime = args.expirationTime;
    this.amount = args.amount;
    this.status = args.status;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(json: any): VirtualAccountPayInDetailModel {
    return new VirtualAccountPayInDetailModel({
      id: json.id,
      accountNumber: json.account_number,
      recipientName: json.recipient_name,
      paymentScheme: PaymentSchemeModel.fromJson(json.payment_scheme),
      expirationTime: DateTime.fromISO(json.expiration_time),
      amount: json.amount,
      status: json.status,
      createdAt: DateTime.fromISO(json.created_at),
      updatedAt: DateTime.fromISO(json.updated_at),
    });
  }

  public toEntity(): VirtualAccountPayInDetailEntity {
    return new VirtualAccountPayInDetailEntity({
      id: this.id,
      accountNumber: this.accountNumber,
      recipientName: this.recipientName,
      paymentScheme: this.paymentScheme.toEntity(),
      expirationTime: this.expirationTime,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
