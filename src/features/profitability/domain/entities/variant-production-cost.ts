import { AbstractEntity } from "@/core/resources/entity";

type VariantProductionCostEntityConstructor = {
  variantId: string;
  quantity: number;
  hppPerUnit: number;
  fixedComponent: number;
  variableComponent: number;
  totalProductionCost: number;
  periodFrom: string | null;
  periodTo: string | null;
};

export class VariantProductionCostEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly quantity: number;
  public readonly hppPerUnit: number;
  public readonly fixedComponent: number;
  public readonly variableComponent: number;
  public readonly totalProductionCost: number;
  public readonly periodFrom: string | null;
  public readonly periodTo: string | null;

  constructor(args: VariantProductionCostEntityConstructor) {
    this.variantId = args.variantId;
    this.quantity = args.quantity;
    this.hppPerUnit = args.hppPerUnit;
    this.fixedComponent = args.fixedComponent;
    this.variableComponent = args.variableComponent;
    this.totalProductionCost = args.totalProductionCost;
    this.periodFrom = args.periodFrom;
    this.periodTo = args.periodTo;
  }
}
