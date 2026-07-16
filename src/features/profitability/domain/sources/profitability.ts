import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VariantCogsModel } from "@/features/profitability/data/models/variant-cogs";
import { VariantProductionCostModel } from "@/features/profitability/data/models/variant-production-cost";
import { VariantGrossProfitModel } from "@/features/profitability/data/models/variant-gross-profit";
import { VariantRecommendedPriceModel } from "@/features/profitability/data/models/variant-recommended-price";

export type GetVariantCogsServiceParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantProductionCostServiceParams = {
  readonly productId: string;
  readonly variantId: string;
  readonly quantity: number;
};

export type GetVariantGrossProfitServiceParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantRecommendedPriceServiceParams = {
  readonly productId: string;
  readonly variantId: string;
  readonly margin: number;
};

export type GetVariantCogsServiceResult = { readonly data: VariantCogsModel };
export type GetVariantProductionCostServiceResult = { readonly data: VariantProductionCostModel };
export type GetVariantGrossProfitServiceResult = { readonly data: VariantGrossProfitModel };
export type GetVariantRecommendedPriceServiceResult = { readonly data: VariantRecommendedPriceModel };

export interface ProfitabilityService {
  getVariantCogs(params: GetVariantCogsServiceParams, session: SessionEntity): Promise<GetVariantCogsServiceResult>;
  getVariantProductionCost(
    params: GetVariantProductionCostServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantProductionCostServiceResult>;
  getVariantGrossProfit(
    params: GetVariantGrossProfitServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantGrossProfitServiceResult>;
  getVariantRecommendedPrice(
    params: GetVariantRecommendedPriceServiceParams,
    session: SessionEntity,
  ): Promise<GetVariantRecommendedPriceServiceResult>;
}
