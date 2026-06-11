import { AbstractEntity } from "@/core/resources/entity";
import { PaymentMethodOptionEntity } from "@/features/payment/domain/entities/payment-method-option.entity";
import { PaymentMethodCategoryEntityConstructor } from "@/features/payment/domain/entities/payment-method-category.entity.types";

export class PaymentMethodCategoryEntity implements AbstractEntity {
  public readonly type: string;
  public readonly title: string;
  public readonly description: string;
  public readonly selections: PaymentMethodOptionEntity[];

  constructor(args: PaymentMethodCategoryEntityConstructor) {
    this.type = args.type;
    this.title = args.title;
    this.description = args.description;
    this.selections = args.selections;
  }
}
