import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostModel } from "@/features/fixed-cost/data/models/fixed-cost";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";
import { ListFixedCostsParams } from "@/features/fixed-cost/domain/repositories/fixed-cost";

export type ListFixedCostsServiceResult = {
  data: FixedCostModel[];
  meta: PaginationMeta;
};

export type CreateFixedCostServiceParams = {
  name: string;
  category: FixedCostCategory;
};

export type UpdateFixedCostServiceParams = {
  id: string;
  name: string;
  category: FixedCostCategory;
};

export interface FixedCostService {
  list(params: ListFixedCostsParams, session: SessionEntity): Promise<ListFixedCostsServiceResult>;
  create(params: CreateFixedCostServiceParams, session: SessionEntity): Promise<FixedCostModel>;
  update(params: UpdateFixedCostServiceParams, session: SessionEntity): Promise<FixedCostModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
