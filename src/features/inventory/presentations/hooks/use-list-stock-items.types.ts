import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

export type UseListStockItemsParams = {
  type?: string;
  page?: number;
  limit?: number;
};

export type ListStockItemFetcherParams = UseListStockItemsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  stockItems: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  stockItems: StockItemEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  stockItems: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListStockItemsReturnType = InitialState | LoadedState | ErrorState;
