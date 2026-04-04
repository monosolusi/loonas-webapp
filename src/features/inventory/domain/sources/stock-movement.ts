import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementModel } from "@/features/inventory/data/models/stock-movement";
import { ListStockMovementsParams } from "@/features/inventory/domain/repositories/stock-movement";

export type ListStockMovementsServiceResult = {
  data: StockMovementModel[];
  meta: PaginationMeta;
};

export interface StockMovementService {
  list(params: ListStockMovementsParams, session: SessionEntity): Promise<ListStockMovementsServiceResult>;
}
