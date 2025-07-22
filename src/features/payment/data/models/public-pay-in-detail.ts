import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";
import { PublicPayInDetailEntity } from "@/features/payment/domain/entities/public-pay-in-detail";

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

interface PublicPayInDetailModelConstructor {
  payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail;
  summary: { invoiceValue: number; fee: number; totalPayable: number };
  paymentMethod: { title: string };
}

export class PublicPayInDetailModel implements AbstractModel {
  public payIn: VirtualAccountPayInDetail | CreditCardFullRedirectPayInDetail;
  public summary: { invoiceValue: number; fee: number; totalPayable: number };
  public paymentMethod: { title: string };

  constructor(args: PublicPayInDetailModelConstructor) {
    this.payIn = args.payIn;
    this.summary = args.summary;
    this.paymentMethod = args.paymentMethod;
  }

  public static fromJson(json: Record<string, any>): PublicPayInDetailModel {
    return new PublicPayInDetailModel({
      payIn: {
        type: json.pay_in.type as PayInType,
        bank: json.pay_in.bank && {
          name: json.pay_in.bank.name,
          logoUrl: json.pay_in.bank.logo_url,
        },
        accountNumber: json.pay_in.account_number,
        expirationTime: json.pay_in.expiration_time && DateTime.fromISO(json.pay_in.expiration_time),
        paymentUrl: json.pay_in.payment_url,
      },
      summary: {
        invoiceValue: json.summary.invoice_value,
        fee: json.summary.fee,
        totalPayable: json.summary.total_payable,
      },
      paymentMethod: {
        title: json.payment_method.title,
      },
    });
  }

  public toEntity(): PublicPayInDetailEntity {
    return new PublicPayInDetailEntity({
      payIn: this.payIn,
      summary: this.summary,
      paymentMethod: this.paymentMethod,
    });
  }
}
