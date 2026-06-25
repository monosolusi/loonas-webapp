import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProfitabilityRepository } from "@/features/profitability/domain/repositories/profitability";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

export type GetVariantRecommendedPriceUseCaseResult = VariantRecommendedPriceEntity;

export class GetVariantRecommendedPriceUseCaseParams {
  constructor(
    public readonly productId: string,
    public readonly variantId: string,
    public readonly margin: number,
  ) {}
}

export class GetVariantRecommendedPriceUseCase
  implements UseCase<DataState<GetVariantRecommendedPriceUseCaseResult>, GetVariantRecommendedPriceUseCaseParams>
{
  constructor(
    private readonly repo: ProfitabilityRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(
    params: GetVariantRecommendedPriceUseCaseParams,
  ): Promise<DataState<GetVariantRecommendedPriceUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      const entity = await this.fetchRecommendedPrice(params, session);
      return new DataSuccess(entity);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async fetchRecommendedPrice(
    params: GetVariantRecommendedPriceUseCaseParams,
    session: SessionEntity,
  ): Promise<GetVariantRecommendedPriceUseCaseResult> {
    const result = await this.repo.getVariantRecommendedPrice(
      { productId: params.productId, variantId: params.variantId, margin: params.margin },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    return result.data!;
  }
}
