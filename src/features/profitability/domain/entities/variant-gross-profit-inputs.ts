import { AbstractEntity } from "@/core/resources/entity";

type VariantGrossProfitInputsEntityConstructor = {
  cogsPerUnit: number;
  unitsSold: number;
  posRevenue: number;
  periodFrom: string | null;
  periodTo: string | null;
};

export class VariantGrossProfitInputsEntity implements AbstractEntity {
  public readonly cogsPerUnit: number;
  public readonly unitsSold: number;
  public readonly posRevenue: number;
  public readonly periodFrom: string | null;
  public readonly periodTo: string | null;

  constructor(args: VariantGrossProfitInputsEntityConstructor) {
    this.cogsPerUnit = args.cogsPerUnit;
    this.unitsSold = args.unitsSold;
    this.posRevenue = args.posRevenue;
    this.periodFrom = args.periodFrom;
    this.periodTo = args.periodTo;
  }
}
