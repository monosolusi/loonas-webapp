import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ManagerialCostProjectionEntity } from "@/features/accounting/domain/entities/managerial-cost-projection";
import { ManagerialCostRepository } from "@/features/accounting/domain/repositories/managerial-cost";

export type GetManagerialCostUseCaseResult = ManagerialCostProjectionEntity[];

export class GetManagerialCostUseCaseParams {
  constructor(
    public readonly periodId: string,
    public readonly variantId?: string,
  ) {}
}

export class GetManagerialCostUseCase implements UseCase<DataState<GetManagerialCostUseCaseResult>, GetManagerialCostUseCaseParams> {
  constructor(
    private readonly repo: ManagerialCostRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetManagerialCostUseCaseParams): Promise<DataState<GetManagerialCostUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return this.repo.getProjection({ periodId: params.periodId, variantId: params.variantId }, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession() {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
