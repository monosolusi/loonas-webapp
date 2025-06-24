import { AbstractEntity } from "@/core/resources/entity";

type SupportedLimitType = { isSupported: true; min: number; max: number };
type NotSupportedLimitType = { isSupported: false };
export type PaymentMethodLimitType = SupportedLimitType | NotSupportedLimitType;

interface PaymentMethodLimitEntityConstructor {
  payIn: PaymentMethodLimitType;
  payOut: PaymentMethodLimitType;
}

export class PaymentMethodLimitEntity implements AbstractEntity {
  public payIn: PaymentMethodLimitType;
  public payOut: PaymentMethodLimitType;

  constructor(args: PaymentMethodLimitEntityConstructor) {
    this.payIn = args.payIn;
    this.payOut = args.payOut;
  }
}
