import { AbstractModel } from "@/core/resources/model";
import { PaymentMethodOptionModelConstructor } from "@/features/payment/data/models/payment-method-option.model.types";
import { PaymentMethodOptionEntity } from "@/features/payment/domain/entities/payment-method-option.entity";
import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";

export class PaymentMethodOptionModel implements AbstractModel {
  public readonly type: string;
  public readonly title: string;
  public readonly baseFee: number;
  public readonly percentageFee: number;
  public readonly gateway: PaymentGatewayModel;
  public readonly scheme?: PaymentSchemeModel;

  constructor(args: PaymentMethodOptionModelConstructor) {
    this.type = args.type;
    this.title = args.title;
    this.baseFee = Number(args.baseFee);
    this.percentageFee = Number(args.percentageFee);
    this.gateway = args.gateway;
    this.scheme = args.scheme;
  }

  public static fromJson(data: Record<string, any>): PaymentMethodOptionModel {
    return new PaymentMethodOptionModel({
      type: data["type"],
      title: data["title"],
      baseFee: Number(data["base_fee"]),
      percentageFee: Number(data["percentage_fee"]),
      gateway: PaymentGatewayModel.fromJson(data["gateway"]),
      scheme: data["scheme"] ? PaymentSchemeModel.fromJson(data["scheme"]) : undefined,
    });
  }

  toEntity(): PaymentMethodOptionEntity {
    return new PaymentMethodOptionEntity({
      type: this.type,
      title: this.title,
      baseFee: this.baseFee,
      percentageFee: this.percentageFee,
      gateway: this.gateway.toEntity(),
      scheme: this.scheme?.toEntity(),
    });
  }
}
