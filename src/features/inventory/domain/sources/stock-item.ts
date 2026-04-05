import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemModel } from "@/features/inventory/data/models/stock-item";
import { ListStockItemsParams, UpdateStockItemParams } from "@/features/inventory/domain/repositories/stock-item";

export type ListStockItemsServiceResult = {
  data: StockItemModel[];
  meta: PaginationMeta;
};

export interface StockItemService {
  list(params: ListStockItemsParams, session: SessionEntity): Promise<ListStockItemsServiceResult>;
  listLowStock(params: ListStockItemsParams, session: SessionEntity): Promise<ListStockItemsServiceResult>;
  get(id: string, session: SessionEntity): Promise<StockItemModel>;
  update(params: UpdateStockItemParams, session: SessionEntity): Promise<StockItemModel>;
}
