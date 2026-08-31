import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";

export type ListBalanceMovementsParams = {
  page?: number;
  limit?: number;
};

export interface BalanceMovementRepository {
  list(
    params: ListBalanceMovementsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<BalanceMovementEntity>>>;
}
