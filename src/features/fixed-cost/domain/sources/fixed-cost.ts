import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostModel } from "@/features/fixed-cost/data/models/fixed-cost";
import { ListFixedCostsParams } from "@/features/fixed-cost/domain/repositories/fixed-cost";

export type ListFixedCostsServiceResult = {
  data: FixedCostModel[];
  meta: PaginationMeta;
};

export interface FixedCostService {
  list(params: ListFixedCostsParams, session: SessionEntity): Promise<ListFixedCostsServiceResult>;
  create(name: string, session: SessionEntity): Promise<FixedCostModel>;
  update(id: string, name: string, session: SessionEntity): Promise<FixedCostModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
