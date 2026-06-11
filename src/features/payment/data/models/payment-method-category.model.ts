import { AbstractModel } from "@/core/resources/model";
import { PaymentMethodOptionModel } from "@/features/payment/data/models/payment-method-option.model";
import { PaymentMethodCategoryModelConstructor } from "@/features/payment/data/models/payment-method-category.model.types";
import { PaymentMethodCategoryEntity } from "@/features/payment/domain/entities/payment-method-category.entity";

export class PaymentMethodCategoryModel implements AbstractModel {
  public type: string;
  public title: string;
  public description: string;
  public selections: PaymentMethodOptionModel[];

  constructor(args: PaymentMethodCategoryModelConstructor) {
    this.type = args.type;
    this.title = args.title;
    this.description = args.description;
    this.selections = args.selections;
  }

  public static fromJson(data: Record<string, any>): PaymentMethodCategoryModel {
    return new PaymentMethodCategoryModel({
      type: data["type"],
      title: data["title"],
      description: data["description"],
      selections: data["selections"].map((selection: any) => PaymentMethodOptionModel.fromJson(selection)),
    });
  }

  toEntity(): PaymentMethodCategoryEntity {
    return new PaymentMethodCategoryEntity({
      type: this.type,
      title: this.title,
      description: this.description,
      selections: this.selections.map((selection) => selection.toEntity()),
    });
  }
}
