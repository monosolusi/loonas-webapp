import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProfitabilityRepository } from "@/features/profitability/domain/repositories/profitability";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";

export type GetVariantGrossProfitUseCaseResult = VariantGrossProfitEntity;

export class GetVariantGrossProfitUseCaseParams {
  constructor(
    public readonly productId: string,
    public readonly variantId: string,
  ) {}
}

export class GetVariantGrossProfitUseCase
  implements UseCase<DataState<GetVariantGrossProfitUseCaseResult>, GetVariantGrossProfitUseCaseParams>
{
  constructor(
    private readonly repo: ProfitabilityRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(
    params: GetVariantGrossProfitUseCaseParams,
  ): Promise<DataState<GetVariantGrossProfitUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      const entity = await this.fetchGrossProfit(params, session);
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

  private async fetchGrossProfit(
    params: GetVariantGrossProfitUseCaseParams,
    session: SessionEntity,
  ): Promise<GetVariantGrossProfitUseCaseResult> {
    const result = await this.repo.getVariantGrossProfit(
      { productId: params.productId, variantId: params.variantId },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    return result.data!;
  }
}
