import { AbstractModel } from "@/core/resources/model";
import { CalculateTaxResultEntity } from "@/features/tax/domain/entities/calculate-tax-result";

interface CalculateTaxResultModelConstructor {
  tax: number;
  taxBase: number;
  amountAfterTax: number;
}

export class CalculateTaxResultModel implements AbstractModel {
  public tax: number;
  public taxBase: number;
  public amountAfterTax: number;

  constructor(args: CalculateTaxResultModelConstructor) {
    this.tax = args.tax;
    this.taxBase = args.taxBase;
    this.amountAfterTax = args.amountAfterTax;
  }

  public static fromJson(json: Record<string, any>): CalculateTaxResultModel {
    return new CalculateTaxResultModel({
      tax: json["tax"],
      taxBase: json["tax_base"],
      amountAfterTax: json["amount_after_tax"],
    });
  }

  toEntity(): CalculateTaxResultEntity {
    return new CalculateTaxResultEntity({
      tax: this.tax,
      taxBase: this.taxBase,
      amountAfterTax: this.amountAfterTax,
    });
  }
}
