import { AbstractModel } from "@/core/resources/model";
import { PaymentGatewayEntity } from "../../domain/entities/payment-gateway";
import { PaymentSchemeModel } from "./payment-scheme";
import { PricingModel } from "./pricing";

interface PaymentGatewayModelConstructor {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  requiresSchemeSelection: boolean;
  pricing: PricingModel;
  schemes: PaymentSchemeModel[];
}

export class PaymentGatewayModel implements AbstractModel {
  public id: string;
  public title: string;
  public description: string;
  public isActive: boolean;
  public requiresSchemeSelection: boolean;
  public pricing: PricingModel;
  public schemes: PaymentSchemeModel[];

  constructor(args: PaymentGatewayModelConstructor) {
    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.isActive = args.isActive;
    this.requiresSchemeSelection = args.requiresSchemeSelection;
    this.pricing = args.pricing;
    this.schemes = args.schemes;
  }

  public static fromJson(json: Record<string, any>): PaymentGatewayModel {
    return new PaymentGatewayModel({
      id: json["id"],
      title: json["title"],
      description: json["description"],
      isActive: json["is_active"],
      requiresSchemeSelection: json["requires_scheme_selection"],
      pricing: PricingModel.fromJson(json["pricing"]),
      schemes: json["schemes"].map((scheme: any) => PaymentSchemeModel.fromJson(scheme))
    });
  }

  toEntity(): PaymentGatewayEntity {
    return new PaymentGatewayEntity(
      this.id,
      this.title,
      this.description,
      this.isActive,
      this.requiresSchemeSelection,
      this.pricing.toEntity(),
      this.schemes.map(scheme => scheme.toEntity())
    );
  }
}