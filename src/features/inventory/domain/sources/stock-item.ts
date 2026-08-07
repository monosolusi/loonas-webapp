import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemModel } from "@/features/inventory/data/models/stock-item";

export type ListStockItemsServiceParams = {
  type?: string;
  page?: number;
  limit?: number;
};

export type UpdateStockItemServiceParams = {
  id: string;
  minStock: number | null;
};

export type ListStockItemsServiceResult = {
  data: StockItemModel[];
  meta: PaginationMeta;
};

export interface StockItemService {
  list(params: ListStockItemsServiceParams, session: SessionEntity): Promise<ListStockItemsServiceResult>;
  listLowStock(params: ListStockItemsServiceParams, session: SessionEntity): Promise<ListStockItemsServiceResult>;
  listNegativeStock(params: ListStockItemsServiceParams, session: SessionEntity): Promise<ListStockItemsServiceResult>;
  get(id: string, session: SessionEntity): Promise<StockItemModel>;
  update(params: UpdateStockItemServiceParams, session: SessionEntity): Promise<StockItemModel>;
}