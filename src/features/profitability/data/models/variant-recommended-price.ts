import { AbstractModel } from "@/core/resources/model";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

export class VariantRecommendedPriceModel implements AbstractModel {
  constructor(
    public readonly variantId: string,
    public readonly hppPerUnit: number,
    public readonly marginPersen: number,
    public readonly recommendedPrice: number,
    public readonly basisPerhitungan: string,
  ) {}

  public static fromJson(data: Record<string, any>): VariantRecommendedPriceModel {
    return new VariantRecommendedPriceModel(
      data["variant"]["id"],
      data["hpp_per_unit"],
      data["margin_persen"],
      data["recommended_price"],
      data["basis_perhitungan"],
    );
  }

  public toEntity(): VariantRecommendedPriceEntity {
    return new VariantRecommendedPriceEntity({
      variantId: this.variantId,
      hppPerUnit: this.hppPerUnit,
      marginPersen: this.marginPersen,
      recommendedPrice: this.recommendedPrice,
      basisPerhitungan: this.basisPerhitungan,
    });
  }
}
