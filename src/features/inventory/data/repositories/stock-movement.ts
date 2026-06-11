import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import { StockMovementRepository, ListStockMovementsParams } from "@/features/inventory/domain/repositories/stock-movement";
import { StockMovementService } from "@/features/inventory/domain/sources/stock-movement";

export class StockMovementRepositoryImpl implements StockMovementRepository {
  constructor(private readonly service: StockMovementService) {}

  public async list(
    params: ListStockMovementsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<StockMovementEntity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        data: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
