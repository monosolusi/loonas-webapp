import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { PayInType } from "../enums/pay-in-type";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";

interface CreditCardFullRedirectPayInDetail {
  type: PayInType.CREDIT_CARD_FULL_REDIRECT;
  paymentUrl: string;
}

interface VirtualAccountPayInDetail {
  type: PayInType.VIRTUAL_ACCOUNT;
  bank: { name: string; logoUrl: string };
  accountNumber: string;
  expirationTime: DateTime;
}

interface PublicPayInDetailEntityConstructor {
  payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail;
  summary: { invoiceValue: number; fee: number; totalPayable: number };
  paymentMethod: { title: string };
  status: PayInStatus;
}

export class PublicPayInDetailEntity implements AbstractEntity {
  public payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail;
  public summary: { invoiceValue: number; fee: number; totalPayable: number };
  public paymentMethod: { title: string };
  public status: PayInStatus;

  constructor(args: PublicPayInDetailEntityConstructor) {
    this.payIn = args.payIn;
    this.summary = args.summary;
    this.paymentMethod = args.paymentMethod;
    this.status = args.status;
  }
}
