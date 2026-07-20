import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";

export type ListFixedCostsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListFixedCostsResult = {
  fixedCosts: FixedCostEntity[];
  meta: PaginationMeta;
};

export type CreateFixedCostParams = {
  name: string;
  category: FixedCostCategory;
};

export type UpdateFixedCostParams = {
  id: string;
  name: string;
  category: FixedCostCategory;
};

export interface FixedCostRepository {
  list(params: ListFixedCostsParams, session: SessionEntity): Promise<DataState<ListFixedCostsResult>>;
  create(params: CreateFixedCostParams, session: SessionEntity): Promise<DataState<FixedCostEntity>>;
  update(params: UpdateFixedCostParams, session: SessionEntity): Promise<DataState<FixedCostEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
