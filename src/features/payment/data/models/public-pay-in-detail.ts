import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";
import { PublicPayInDetailEntity } from "@/features/payment/domain/entities/public-pay-in-detail";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";

interface CreditCardFullRedirectPayInDetail {
  type:
    | PayInType.CREDIT_CARD_FULL_REDIRECT
    | PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS
    | PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS
    | PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS;
  id: string;
  paymentUrl: string;
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

interface PublicPayInDetailModelConstructor {
  payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail | QrisPayInDetail;
  summary: { invoiceValue: number; fee: number; totalPayable: number };
  paymentMethod: { title: string };
  status: PayInStatus;
}

export class PublicPayInDetailModel implements AbstractModel {
  public payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail | QrisPayInDetail;
  public summary: { invoiceValue: number; fee: number; totalPayable: number };
  public paymentMethod: { title: string };
  public status: PayInStatus;

  constructor(args: PublicPayInDetailModelConstructor) {
    this.payIn = args.payIn;
    this.summary = args.summary;
    this.paymentMethod = args.paymentMethod;
    this.status = args.status;
  }

  public static fromJson(json: Record<string, any>): PublicPayInDetailModel {
    return new PublicPayInDetailModel({
      // TODO: Fix this in the future
      // @ts-ignore
      payIn: {
        type: json.pay_in.type as PayInType,
        id: json.pay_in.id,
        bank: json.pay_in.bank && {
          name: json.pay_in.bank.name,
          logoUrl: json.pay_in.bank.logo_url,
        },
        accountNumber: json.pay_in.account_number,
        expirationTime: json.pay_in.expiration_time && DateTime.fromISO(json.pay_in.expiration_time),
        paymentUrl: json.pay_in.payment_url,
        qrString: json.pay_in.qr_string,
      },
      summary: {
        invoiceValue: json.summary.invoice_value,
        fee: json.summary.fee,
        totalPayable: json.summary.total_payable,
      },
      paymentMethod: { title: json.payment_method.title },
      status: json.status,
    });
  }

  public toEntity(): PublicPayInDetailEntity {
    return new PublicPayInDetailEntity({
      payIn: this.payIn,
      summary: this.summary,
      paymentMethod: this.paymentMethod,
      status: this.status,
    });
  }
}
