import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceMovementModel } from "@/features/balance/data/models/balance-movement";

export type ListBalanceMovementsServiceParams = {
  page?: number;
  limit?: number;
};

export type ListBalanceMovementsServiceResult = {
  data: BalanceMovementModel[];
  meta: PaginationMeta;
};

export interface BalanceMovementService {
  list(params: ListBalanceMovementsServiceParams, session: SessionEntity): Promise<ListBalanceMovementsServiceResult>;
}
