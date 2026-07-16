import { AbstractEntity } from "@/core/resources/entity";
import { CogsLineEntity } from "@/features/profitability/domain/entities/cogs-line";

type VariantCogsEntityConstructor = {
  variantId: string;
  materialCostPerUnit: number;
  packagingCostPerUnit: number;
  overheadCostPerUnit: number;
  cogsPerUnit: number;
  basis: string;
  lines: CogsLineEntity[];
};

export class VariantCogsEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly materialCostPerUnit: number;
  public readonly packagingCostPerUnit: number;
  public readonly overheadCostPerUnit: number;
  public readonly cogsPerUnit: number;
  public readonly basis: string;
  public readonly lines: CogsLineEntity[];

  constructor(args: VariantCogsEntityConstructor) {
    this.variantId = args.variantId;
    this.materialCostPerUnit = args.materialCostPerUnit;
    this.packagingCostPerUnit = args.packagingCostPerUnit;
    this.overheadCostPerUnit = args.overheadCostPerUnit;
    this.cogsPerUnit = args.cogsPerUnit;
    this.basis = args.basis;
    this.lines = args.lines;
  }

  public get hasMissingCost(): boolean {
    return this.lines.some((l) => !l.costAvailable);
  }
}
