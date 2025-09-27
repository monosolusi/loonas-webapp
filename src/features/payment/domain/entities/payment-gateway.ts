import { AbstractEntity } from "@/core/resources/entity";
import { PaymentSchemeEntity } from "./payment-scheme";
import { PricingEntity } from "./pricing";

type PaymentGatewayEntityConstructor = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  requiresSchemeSelection: boolean;
  pricing: PricingEntity;
  schemes: PaymentSchemeEntity[];
  type: string;
};

export class PaymentGatewayEntity implements AbstractEntity {
  public id: string;
  public title: string;
  public description: string;
  public isActive: boolean;
  public requiresSchemeSelection: boolean;
  public pricing: PricingEntity;
  public schemes: PaymentSchemeEntity[];
  public type: string;

  constructor(args: PaymentGatewayEntityConstructor) {
    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.isActive = args.isActive;
    this.requiresSchemeSelection = args.requiresSchemeSelection;
    this.pricing = args.pricing;
    this.schemes = args.schemes;
    this.type = args.type;
  }
}
