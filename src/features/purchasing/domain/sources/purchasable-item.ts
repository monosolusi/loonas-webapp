import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemModel } from "@/features/inventory/data/models/stock-item";
import { ListPurchasableItemsParams } from "@/features/purchasing/domain/repositories/purchasable-item";

export type ListPurchasableItemsServiceResult = {
  data: StockItemModel[];
  meta: PaginationMeta;
};

export interface PurchasableItemService {
  list(params: ListPurchasableItemsParams, session: SessionEntity): Promise<ListPurchasableItemsServiceResult>;
}
