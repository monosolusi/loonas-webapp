import { AbstractEntity } from "@/core/resources/entity";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";

type PaymentMethodEntityConstructor = {
  id: string;
  paymentGateway: PaymentGatewayEntity;
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export class PaymentMethodEntity implements AbstractEntity {
  public readonly id: string;
  public readonly paymentGateway: PaymentGatewayEntity;
  public readonly isEnabled: boolean;
  public readonly sortOrder: number;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PaymentMethodEntityConstructor) {
    this.id = args.id;
    this.paymentGateway = args.paymentGateway;
    this.isEnabled = args.isEnabled;
    this.sortOrder = args.sortOrder;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
