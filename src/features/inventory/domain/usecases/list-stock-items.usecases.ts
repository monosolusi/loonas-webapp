import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemRepository } from "@/features/inventory/domain/repositories/stock-item";

type ListStockItemsInput = {
  type?: string;
  page?: number;
  limit?: number;
};

export class ListStockItemsUseCaseParams {
  constructor(public readonly params: ListStockItemsInput) {}
}

export class ListStockItemsUseCase
  implements UseCase<DataState<PaginatedData<StockItemEntity>>, ListStockItemsUseCaseParams>
{
  constructor(
    private readonly stockItemRepository: StockItemRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListStockItemsUseCaseParams): Promise<DataState<PaginatedData<StockItemEntity>>> {
    try {
      const session = await this.resolveSession();
      return await this.stockItemRepository.list(params.params, session);
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
