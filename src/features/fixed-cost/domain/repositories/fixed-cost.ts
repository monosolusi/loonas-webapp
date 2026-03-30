import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";

export type ListFixedCostsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListFixedCostsResult = {
  fixedCosts: FixedCostEntity[];
  meta: PaginationMeta;
};

export interface FixedCostRepository {
  list(params: ListFixedCostsParams, session: SessionEntity): Promise<DataState<ListFixedCostsResult>>;
  create(name: string, session: SessionEntity): Promise<DataState<FixedCostEntity>>;
  update(id: string, name: string, session: SessionEntity): Promise<DataState<FixedCostEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
