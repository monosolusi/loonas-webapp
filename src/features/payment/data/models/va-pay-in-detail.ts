import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";
import { AbstractModel } from "@/core/resources/model";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { DateTime } from "luxon";

interface VirtualAccountPayInDetailModelConstructor {
  id: string;
  accountNumber: string;
  recipientName: string;
  paymentScheme: PaymentSchemeModel;
  expirationTime: string;
  amount: string;
  status: PayInStatus;
  createdAt: string;
  updatedAt: string;
}

export class VirtualAccountPayInDetailModel implements AbstractModel {
  public id: string;
  public accountNumber: string;
  public recipientName: string;
  public paymentScheme: PaymentSchemeModel;
  public expirationTime: string;
  public amount: string;
  public status: PayInStatus;
  public createdAt: string;
  public updatedAt: string;

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
      expirationTime: json.expiration_time,
      amount: json.amount,
      status: json.status,
      createdAt: json.created_at,
      updatedAt: json.updated_at
    });
  }

  public toEntity(): VirtualAccountPayInDetailEntity {
    return new VirtualAccountPayInDetailEntity({
      id: this.id,
      accountNumber: this.accountNumber,
      recipientName: this.recipientName,
      paymentScheme: this.paymentScheme.toEntity(),
      expirationTime: DateTime.fromISO(this.expirationTime),
      amount: this.amount,
      status: this.status,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt)
    });
  }

}