import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";
import { BalanceMovementRepository } from "@/features/balance/domain/repositories/balance-movement";

type ListBalanceMovementsInput = {
  page?: number;
  limit?: number;
};

export class ListBalanceMovementsUseCaseParams {
  constructor(public readonly params: ListBalanceMovementsInput) {}
}

export class ListBalanceMovementsUseCase implements UseCase<
  DataState<PaginatedData<BalanceMovementEntity>>,
  ListBalanceMovementsUseCaseParams
> {
  constructor(
    private readonly balanceMovementRepository: BalanceMovementRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(
    params: ListBalanceMovementsUseCaseParams,
  ): Promise<DataState<PaginatedData<BalanceMovementEntity>>> {
    try {
      const session = await this.resolveSession();
      return await this.balanceMovementRepository.list(params.params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
