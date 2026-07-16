import { AbstractEntity } from "@/core/resources/entity";

type VariantRecommendedPriceEntityConstructor = {
  variantId: string;
  cogsPerUnit: number;
  marginPercent: number;
  recommendedPrice: number;
  calculationBasis: string;
};

export class VariantRecommendedPriceEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly cogsPerUnit: number;
  public readonly marginPercent: number;
  public readonly recommendedPrice: number;
  public readonly calculationBasis: string;

  constructor(args: VariantRecommendedPriceEntityConstructor) {
    this.variantId = args.variantId;
    this.cogsPerUnit = args.cogsPerUnit;
    this.marginPercent = args.marginPercent;
    this.recommendedPrice = args.recommendedPrice;
    this.calculationBasis = args.calculationBasis;
  }
}
