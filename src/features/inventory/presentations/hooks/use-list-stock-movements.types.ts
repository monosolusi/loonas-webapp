import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";

export type UseListStockMovementsParams = {
  stockItemId?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export type ListStockMovementFetcherParams = UseListStockMovementsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  movements: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  movements: StockMovementEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  movements: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListStockMovementsReturnType = InitialState | LoadedState | ErrorState;
