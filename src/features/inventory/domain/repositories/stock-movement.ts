import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";

export type ListStockMovementsParams = {
  stockItemId?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export interface StockMovementRepository {
  list(params: ListStockMovementsParams, session: SessionEntity): Promise<DataState<PaginatedData<StockMovementEntity>>>;
}
