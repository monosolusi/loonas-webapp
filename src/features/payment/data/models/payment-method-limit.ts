import { PaymentMethodLimitEntity } from "../../domain/entities/payment-method-limit";

type SupportedLimitType = { isSupported: true; min: number; max: number };
type NotSupportedLimitType = { isSupported: false };
export type PaymentMethodLimitType = SupportedLimitType | NotSupportedLimitType;

interface PaymentMethodLimitModelConstructor {
  payIn: PaymentMethodLimitType;
  payOut: PaymentMethodLimitType;
}

export class PaymentMethodLimitModel implements PaymentMethodLimitModelConstructor {
  public payIn: PaymentMethodLimitType;
  public payOut: PaymentMethodLimitType;

  constructor(args: PaymentMethodLimitModelConstructor) {
    this.payIn = args.payIn;
    this.payOut = args.payOut;
  }

  public static fromJson(json: Record<string, any>): PaymentMethodLimitModel {
    return new PaymentMethodLimitModel({
      payIn: json.pay_in.is_supported
        ? { isSupported: true, min: json.pay_in.min, max: json.pay_in.max }
        : { isSupported: false },
      payOut: json.pay_out.is_supported
        ? { isSupported: true, min: json.pay_out.min, max: json.pay_out.max }
        : { isSupported: false },
    });
  }

  public toEntity(): PaymentMethodLimitEntity {
    return new PaymentMethodLimitEntity({
      payIn: this.payIn,
      payOut: this.payOut,
    });
  }
}
