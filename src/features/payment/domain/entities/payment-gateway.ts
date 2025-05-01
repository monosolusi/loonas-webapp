import { AbstractEntity } from "@/core/resources/entity";
import { PaymentSchemeEntity } from "./payment-scheme";
import { PricingEntity } from "./pricing";

export class PaymentGatewayEntity implements AbstractEntity {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public isActive: boolean,
    public requiresSchemeSelection: boolean,
    public pricing: PricingEntity,
    public schemes: PaymentSchemeEntity[]
  ) {}
}