import { AbstractEntity } from "@/core/resources/entity";
import { CogsLineEntity } from "@/features/profitability/domain/entities/cogs-line";
import { OverheadAllocationEntity } from "@/features/profitability/domain/entities/overhead-allocation";

type VariantCogsEntityConstructor = {
  variantId: string;
  materialCostPerUnit: number;
  overheadCostPerUnit: number;
  cogsPerUnit: number;
  basis: string;
  lines: CogsLineEntity[];
  overheadAllocation: OverheadAllocationEntity;
};

export class VariantCogsEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly materialCostPerUnit: number;
  public readonly overheadCostPerUnit: number;
  public readonly cogsPerUnit: number;
  public readonly basis: string;
  public readonly lines: CogsLineEntity[];
  public readonly overheadAllocation: OverheadAllocationEntity;

  constructor(args: VariantCogsEntityConstructor) {
    this.variantId = args.variantId;
    this.materialCostPerUnit = args.materialCostPerUnit;
    this.overheadCostPerUnit = args.overheadCostPerUnit;
    this.cogsPerUnit = args.cogsPerUnit;
    this.basis = args.basis;
    this.lines = args.lines;
    this.overheadAllocation = args.overheadAllocation;
  }

  public get hasMissingCost(): boolean {
    return this.lines.some((l) => !l.costAvailable);
  }
}
