import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemRepository, ListStockItemsParams, UpdateStockItemParams } from "@/features/inventory/domain/repositories/stock-item";
import { StockItemService } from "@/features/inventory/domain/sources/stock-item";

export class StockItemRepositoryImpl implements StockItemRepository {
  constructor(private readonly service: StockItemService) {}

  public async list(
    params: ListStockItemsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<StockItemEntity>>> {
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

  public async listLowStock(
    params: ListStockItemsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<StockItemEntity>>> {
    try {
      const result = await this.service.listLowStock(params, session);
      return new DataSuccess({
        data: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(id: string, session: SessionEntity): Promise<DataState<StockItemEntity>> {
    try {
      const result = await this.service.get(id, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(params: UpdateStockItemParams, session: SessionEntity): Promise<DataState<StockItemEntity>> {
    try {
      const result = await this.service.update(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
