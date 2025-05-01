import { AbstractEntity } from "@/core/resources/entity";

export class PaymentSchemeEntity implements AbstractEntity {
  constructor(
    public id: string,
    public name: string,
    public logoUrl: string,
    public isActive: boolean
  ) {}
}