import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";

interface VirtualAccountPayInDetailEntityConstructor {
  id: string;
  accountNumber: string;
  recipientName: string;
  paymentScheme: PaymentSchemeEntity;
  expirationTime: DateTime;
  amount: number;
  status: PayInStatus;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class VirtualAccountPayInDetailEntity implements AbstractEntity {
  public id: string;
  public accountNumber: string;
  public recipientName: string;
  public paymentScheme: PaymentSchemeEntity;
  public expirationTime: DateTime;
  public amount: number;
  public status: PayInStatus;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: VirtualAccountPayInDetailEntityConstructor) {
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
}
