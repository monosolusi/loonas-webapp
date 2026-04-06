import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

export type UseListPurchasableItemsParams = {
  page?: number;
  limit?: number;
};

export type ListPurchasableItemFetcherParams = UseListPurchasableItemsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  items: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  items: StockItemEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  items: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListPurchasableItemsReturnType = InitialState | LoadedState | ErrorState;
