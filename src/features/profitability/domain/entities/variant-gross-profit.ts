import { AbstractEntity } from "@/core/resources/entity";
import { VariantGrossProfitInputsEntity } from "@/features/profitability/domain/entities/variant-gross-profit-inputs";
import { OverheadAllocationEntity } from "@/features/profitability/domain/entities/overhead-allocation";

type VariantGrossProfitEntityConstructor = {
  variantId: string;
  needsData: boolean;
  needsDataReason: string | null;
  estimatedGrossProfit: number | null;
  isEstimate: boolean;
  basis: string;
  formula: string | null;
  inputs: VariantGrossProfitInputsEntity | null;
  overheadAllocation: OverheadAllocationEntity;
};

export class VariantGrossProfitEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly needsData: boolean;
  public readonly needsDataReason: string | null;
  public readonly estimatedGrossProfit: number | null;
  public readonly isEstimate: boolean;
  public readonly basis: string;
  public readonly formula: string | null;
  public readonly inputs: VariantGrossProfitInputsEntity | null;
  public readonly overheadAllocation: OverheadAllocationEntity;

  constructor(args: VariantGrossProfitEntityConstructor) {
    this.variantId = args.variantId;
    this.needsData = args.needsData;
    this.needsDataReason = args.needsDataReason;
    this.estimatedGrossProfit = args.estimatedGrossProfit;
    this.isEstimate = args.isEstimate;
    this.basis = args.basis;
    this.formula = args.formula;
    this.inputs = args.inputs;
    this.overheadAllocation = args.overheadAllocation;
  }
}
