import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ManagerialCostAllocationResultEntity } from "@/features/accounting/domain/entities/managerial-cost-allocation-result";
import { ManagerialCostRepository } from "@/features/accounting/domain/repositories/managerial-cost";

export type AllocateManagerialCostUseCaseResult = ManagerialCostAllocationResultEntity;

export class AllocateManagerialCostUseCaseParams {
  constructor(public readonly periodId: string) {}
}

export class AllocateManagerialCostUseCase implements UseCase<DataState<AllocateManagerialCostUseCaseResult>, AllocateManagerialCostUseCaseParams> {
  constructor(
    private readonly repo: ManagerialCostRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: AllocateManagerialCostUseCaseParams): Promise<DataState<AllocateManagerialCostUseCaseResult>> {
    try {
      const session = await this.resolveSession();
      return this.repo.allocate({ periodId: params.periodId }, session);
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
