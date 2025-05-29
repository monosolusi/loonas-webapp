import { AbstractEntity } from "@/core/resources/entity";

interface CalculateTaxResultEntityConstructor {
  tax: number;
  taxBase: number;
  amountAfterTax: number;
}

export class CalculateTaxResultEntity implements AbstractEntity {
  public tax: number;
  public taxBase: number;
  public amountAfterTax: number;

  constructor(args: CalculateTaxResultEntityConstructor) {
    this.tax = args.tax;
    this.taxBase = args.taxBase;
    this.amountAfterTax = args.amountAfterTax;
  }
}
