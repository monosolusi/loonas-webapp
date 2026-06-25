import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ProfitabilityRepository,
  GetVariantHppRepoParams,
  GetVariantHppResult,
  GetVariantProductionCostRepoParams,
  GetVariantProductionCostResult,
  GetVariantGrossProfitRepoParams,
  GetVariantGrossProfitResult,
  GetVariantRecommendedPriceRepoParams,
  GetVariantRecommendedPriceResult,
} from "@/features/profitability/domain/repositories/profitability";
import { ProfitabilityService } from "@/features/profitability/domain/sources/profitability";

export class ProfitabilityRepositoryImpl implements ProfitabilityRepository {
  constructor(private readonly service: ProfitabilityService) {}

  public async getVariantHpp(
    params: GetVariantHppRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantHppResult>> {
    try {
      const result = await this.service.getVariantHpp(params, session);
      return new DataSuccess(result.data.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getVariantProductionCost(
    params: GetVariantProductionCostRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantProductionCostResult>> {
    try {
      const result = await this.service.getVariantProductionCost(params, session);
      return new DataSuccess(result.data.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getVariantGrossProfit(
    params: GetVariantGrossProfitRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantGrossProfitResult>> {
    try {
      const result = await this.service.getVariantGrossProfit(params, session);
      return new DataSuccess(result.data.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getVariantRecommendedPrice(
    params: GetVariantRecommendedPriceRepoParams,
    session: SessionEntity,
  ): Promise<DataState<GetVariantRecommendedPriceResult>> {
    try {
      const result = await this.service.getVariantRecommendedPrice(params, session);
      return new DataSuccess(result.data.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
