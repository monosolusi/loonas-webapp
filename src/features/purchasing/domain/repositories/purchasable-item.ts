import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

export type ListPurchasableItemsParams = {
  page?: number;
  limit?: number;
};

export interface PurchasableItemRepository {
  list(params: ListPurchasableItemsParams, session: SessionEntity): Promise<DataState<PaginatedData<StockItemEntity>>>;
}
