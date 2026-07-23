import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VariantCogsEntity } from "@/features/profitability/domain/entities/variant-cogs";
import { VariantProductionCostEntity } from "@/features/profitability/domain/entities/variant-production-cost";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

export type GetVariantCogsRepoParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantProductionCostRepoParams = {
  readonly productId: string;
  readonly variantId: string;
  readonly quantity: number;
};

export type GetVariantGrossProfitRepoParams = {
  readonly productId: string;
  readonly variantId: string;
};

export type GetVariantRecommendedPriceRepoParams = {
  readonly productId: string;
  readonly variantId: string;
  readonly margin: number;
};

export type GetVariantCogsResult = VariantCogsEntity;
export type GetVariantProductionCostResult = VariantProductionCostEntity;
export type GetVariantGrossProfitResult = VariantGrossProfitEntity;
export type GetVariantRecommendedPriceResult = VariantRecommendedPriceEntity;

export interface ProfitabilityRepository {
  getVariantCogs(params: GetVariantCogsRepoParams, session: SessionEntity): Promise<DataState<GetVariantCogsResult>>;
  getVariantProductionCost(
    params: GetVariantProductionCostRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantProductionCostResult>>;
  getVariantGrossProfit(
    params: GetVariantGrossProfitRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantGrossProfitResult>>;
  getVariantRecommendedPrice(
    params: GetVariantRecommendedPriceRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantRecommendedPriceResult>>;
}
