import { AbstractEntity } from "@/core/resources/entity";

type VariantRecommendedPriceEntityConstructor = {
  variantId: string;
  hppPerUnit: number;
  marginPersen: number;
  recommendedPrice: number;
  basisPerhitungan: string;
};

export class VariantRecommendedPriceEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly hppPerUnit: number;
  public readonly marginPersen: number;
  public readonly recommendedPrice: number;
  public readonly basisPerhitungan: string;

  constructor(args: VariantRecommendedPriceEntityConstructor) {
    this.variantId = args.variantId;
    this.hppPerUnit = args.hppPerUnit;
    this.marginPersen = args.marginPersen;
    this.recommendedPrice = args.recommendedPrice;
    this.basisPerhitungan = args.basisPerhitungan;
  }
}
