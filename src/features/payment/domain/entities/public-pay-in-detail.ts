import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { PayInType } from "../enums/pay-in-type";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";

interface CreditCardFullRedirectPayInDetail {
  type:
    | PayInType.CREDIT_CARD_FULL_REDIRECT
    | PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS
    | PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS
    | PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS;
  paymentUrl: string;
  id: string;
}

interface VirtualAccountPayInDetail {
  type: PayInType.VIRTUAL_ACCOUNT;
  id: string;
  bank: { name: string; logoUrl: string };
  accountNumber: string;
  expirationTime: DateTime;
}

interface QrisPayInDetail {
  type: PayInType.QRIS;
  id: string;
  qrString: string;
  expirationTime: DateTime;
}

interface PublicPayInDetailEntityConstructor {
  payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail | QrisPayInDetail;
  summary: { invoiceValue: number; fee: number; totalPayable: number };
  paymentMethod: { title: string };
  status: PayInStatus;
}

export class PublicPayInDetailEntity implements AbstractEntity {
  public payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail | QrisPayInDetail;
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
