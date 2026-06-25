import { AbstractEntity } from "@/core/resources/entity";
import { HppLineEntity } from "@/features/profitability/domain/entities/hpp-line";

type VariantHppEntityConstructor = {
  variantId: string;
  materialCostPerUnit: number;
  packagingCostPerUnit: number;
  overheadCostPerUnit: number;
  hppPerUnit: number;
  basis: string;
  lines: HppLineEntity[];
};

export class VariantHppEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly materialCostPerUnit: number;
  public readonly packagingCostPerUnit: number;
  public readonly overheadCostPerUnit: number;
  public readonly hppPerUnit: number;
  public readonly basis: string;
  public readonly lines: HppLineEntity[];

  constructor(args: VariantHppEntityConstructor) {
    this.variantId = args.variantId;
    this.materialCostPerUnit = args.materialCostPerUnit;
    this.packagingCostPerUnit = args.packagingCostPerUnit;
    this.overheadCostPerUnit = args.overheadCostPerUnit;
    this.hppPerUnit = args.hppPerUnit;
    this.basis = args.basis;
    this.lines = args.lines;
  }

  public get hasMissingCost(): boolean {
    return this.lines.some((l) => !l.costAvailable);
  }
}
