import { AbstractEntity } from "@/core/resources/entity";

export class PricingEntity implements AbstractEntity {
  constructor(
    public baseFee: number,
    public percentageFee: number
  ) {}
}