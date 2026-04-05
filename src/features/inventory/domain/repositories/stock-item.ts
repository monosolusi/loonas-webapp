import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

export type ListStockItemsParams = {
  type?: string;
  page?: number;
  limit?: number;
};

export type UpdateStockItemParams = {
  id: string;
  minStock: number | null;
};

export interface StockItemRepository {
  list(params: ListStockItemsParams, session: SessionEntity): Promise<DataState<PaginatedData<StockItemEntity>>>;
  listLowStock(params: ListStockItemsParams, session: SessionEntity): Promise<DataState<PaginatedData<StockItemEntity>>>;
  get(id: string, session: SessionEntity): Promise<DataState<StockItemEntity>>;
  update(params: UpdateStockItemParams, session: SessionEntity): Promise<DataState<StockItemEntity>>;
}
