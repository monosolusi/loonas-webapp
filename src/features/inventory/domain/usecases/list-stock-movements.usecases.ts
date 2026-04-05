import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import { StockMovementRepository } from "@/features/inventory/domain/repositories/stock-movement";

type ListStockMovementsInput = {
  stockItemId?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export class ListStockMovementsUseCaseParams {
  constructor(public readonly params: ListStockMovementsInput) {}
}

export class ListStockMovementsUseCase
  implements UseCase<DataState<PaginatedData<StockMovementEntity>>, ListStockMovementsUseCaseParams>
{
  constructor(
    private readonly stockMovementRepository: StockMovementRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(
    params: ListStockMovementsUseCaseParams,
  ): Promise<DataState<PaginatedData<StockMovementEntity>>> {
    try {
      const session = await this.resolveSession();
      return await this.stockMovementRepository.list(params.params, session);
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
