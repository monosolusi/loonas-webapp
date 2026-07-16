import { AbstractModel } from "@/core/resources/model";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

export class VariantRecommendedPriceModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly cogsPerUnit: number,
    public readonly marginPercent: number,
    public readonly recommendedPrice: number,
    public readonly calculationBasis: string,
  ) {}

  public static fromJson(data: Record<string, any>): VariantRecommendedPriceModel {
    return new VariantRecommendedPriceModel(
      data["variant"]["id"],
      data["cogs_per_unit"],
      data["margin_percent"],
      data["recommended_price"],
      data["calculation_basis"],
    );
  }

  public toEntity(): VariantRecommendedPriceEntity {
    return new VariantRecommendedPriceEntity({
      variantId: this.variantId,
      cogsPerUnit: this.cogsPerUnit,
      marginPercent: this.marginPercent,
      recommendedPrice: this.recommendedPrice,
      calculationBasis: this.calculationBasis,
    });
  }
}
