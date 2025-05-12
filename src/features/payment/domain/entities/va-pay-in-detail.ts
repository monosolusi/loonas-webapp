import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { PaymentSchemeEntity } from "./payment-scheme";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";


interface VirtualAccountPayInDetailEntityConstructor {
  id: string;
  accountNumber: string;
  recipientName: string;
  paymentScheme: PaymentSchemeEntity;
  expirationTime: DateTime;
  amount: string;
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
  public amount: string;
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