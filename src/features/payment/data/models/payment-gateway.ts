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
  type: string;
}

export class PaymentGatewayModel implements AbstractModel {
  public id: string;
  public title: string;
  public description: string;
  public isActive: boolean;
  public requiresSchemeSelection: boolean;
  public pricing: PricingModel;
  public schemes: PaymentSchemeModel[];
  public type: string;

  constructor(args: PaymentGatewayModelConstructor) {
    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.isActive = args.isActive;
    this.requiresSchemeSelection = args.requiresSchemeSelection;
    this.pricing = args.pricing;
    this.schemes = args.schemes;
    this.type = args.type;
  }

  public static fromJson(json: Record<string, any>): PaymentGatewayModel {
    const rawSchemes = json["schemes"];
    return new PaymentGatewayModel({
      id: json["id"] ?? "",
      title: json["title"] ?? "",
      description: json["description"] ?? "",
      isActive: json["is_active"] ?? false,
      requiresSchemeSelection: json["requires_scheme_selection"] ?? false,
      pricing: PricingModel.fromJson(json["pricing"]),
      schemes: Array.isArray(rawSchemes) ? rawSchemes.map((scheme: any) => PaymentSchemeModel.fromJson(scheme)) : [],
      type: json["type"] ?? "",
    });
  }

  toEntity(): PaymentGatewayEntity {
    return new PaymentGatewayEntity({
      id: this.id,
      title: this.title,
      description: this.description,
      isActive: this.isActive,
      requiresSchemeSelection: this.requiresSchemeSelection,
      pricing: this.pricing.toEntity(),
      schemes: this.schemes.map((scheme) => scheme.toEntity()),
      type: this.type,
    });
  }
}
