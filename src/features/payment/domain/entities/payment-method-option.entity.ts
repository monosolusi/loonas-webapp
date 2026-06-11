import { AbstractEntity } from "@/core/resources/entity";
import { PaymentMethodOptionEntityConstructor } from "@/features/payment/domain/entities/payment-method-option.entity.types";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";

export class PaymentMethodOptionEntity implements AbstractEntity {
  public readonly type: string;
  public readonly title: string;
  public readonly baseFee: number;
  public readonly percentageFee: number;
  public readonly gateway: PaymentGatewayEntity;
  public readonly scheme?: PaymentSchemeEntity;

  constructor(args: PaymentMethodOptionEntityConstructor) {
    this.type = args.type;
    this.title = args.title;
    this.baseFee = args.baseFee;
    this.percentageFee = args.percentageFee;
    this.gateway = args.gateway;
    this.scheme = args.scheme;
  }

  calculateFee(params: { amount: number }): number {
    const percentageFee = params.amount * (this.percentageFee / 100);
    return percentageFee + this.baseFee;
  }
}
