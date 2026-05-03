import { AbstractModel } from "@/core/resources/model";
import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";

type PaymentMethodModelConstructor = {
  id: string;
  paymentGateway: PaymentGatewayModel;
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export class PaymentMethodModel implements AbstractModel {
  public readonly id: string;
  public readonly paymentGateway: PaymentGatewayModel;
  public readonly isEnabled: boolean;
  public readonly sortOrder: number;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PaymentMethodModelConstructor) {
    this.id = args.id;
    this.paymentGateway = args.paymentGateway;
    this.isEnabled = args.isEnabled;
    this.sortOrder = args.sortOrder;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): PaymentMethodModel {
    return new PaymentMethodModel({
      id: data["id"] ?? "",
      paymentGateway: PaymentGatewayModel.fromJson(data["payment_gateway"]),
      isEnabled: data["is_enabled"] ?? false,
      sortOrder: data["sort_order"] ?? 0,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): PaymentMethodEntity {
    return new PaymentMethodEntity({
      id: this.id,
      paymentGateway: this.paymentGateway.toEntity(),
      isEnabled: this.isEnabled,
      sortOrder: this.sortOrder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
