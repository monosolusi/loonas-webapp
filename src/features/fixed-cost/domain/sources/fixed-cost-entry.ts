import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntryModel } from "@/features/fixed-cost/data/models/fixed-cost-entry";
import {
  ListFixedCostEntryByDateParams,
  ListFixedCostEntryParams,
  CreateFixedCostEntryParams,
  UpdateFixedCostEntryParams,
  DeleteFixedCostEntryParams,
} from "@/features/fixed-cost/domain/repositories/fixed-cost-entry";

export type ListFixedCostEntryServiceResult = {
  data: FixedCostEntryModel[];
  meta: PaginationMeta;
};

export interface FixedCostEntryService {
  listByDate(params: ListFixedCostEntryByDateParams, session: SessionEntity): Promise<ListFixedCostEntryServiceResult>;
  list(params: ListFixedCostEntryParams, session: SessionEntity): Promise<ListFixedCostEntryServiceResult>;
  create(params: CreateFixedCostEntryParams, session: SessionEntity): Promise<FixedCostEntryModel>;
  update(params: UpdateFixedCostEntryParams, session: SessionEntity): Promise<FixedCostEntryModel>;
  delete(params: DeleteFixedCostEntryParams, session: SessionEntity): Promise<void>;
}
