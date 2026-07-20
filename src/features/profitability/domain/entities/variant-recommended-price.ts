import { AbstractEntity } from "@/core/resources/entity";
import { OverheadAllocationEntity } from "@/features/profitability/domain/entities/overhead-allocation";

type VariantRecommendedPriceEntityConstructor = {
  variantId: string;
  cogsPerUnit: number;
  marginPercent: number;
  recommendedPrice: number;
  calculationBasis: string;
  overheadAllocation: OverheadAllocationEntity;
};

export class VariantRecommendedPriceEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly cogsPerUnit: number;
  public readonly marginPercent: number;
  public readonly recommendedPrice: number;
  public readonly calculationBasis: string;
  public readonly overheadAllocation: OverheadAllocationEntity;

  constructor(args: VariantRecommendedPriceEntityConstructor) {
    this.variantId = args.variantId;
    this.cogsPerUnit = args.cogsPerUnit;
    this.marginPercent = args.marginPercent;
    this.recommendedPrice = args.recommendedPrice;
    this.calculationBasis = args.calculationBasis;
    this.overheadAllocation = args.overheadAllocation;
  }
}
