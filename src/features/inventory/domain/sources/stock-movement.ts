import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementModel } from "@/features/inventory/data/models/stock-movement";

export type ListStockMovementsServiceParams = {
  stockItemId?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export type ListStockMovementsServiceResult = {
  data: StockMovementModel[];
  meta: PaginationMeta;
};

export interface StockMovementService {
  list(params: ListStockMovementsServiceParams, session: SessionEntity): Promise<ListStockMovementsServiceResult>;
}
