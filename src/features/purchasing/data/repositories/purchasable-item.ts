import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { PurchasableItemRepository, ListPurchasableItemsParams } from "@/features/purchasing/domain/repositories/purchasable-item";
import { PurchasableItemService } from "@/features/purchasing/domain/sources/purchasable-item";

export class PurchasableItemRepositoryImpl implements PurchasableItemRepository {
  constructor(private readonly service: PurchasableItemService) {}

  public async list(
    params: ListPurchasableItemsParams,
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
}
