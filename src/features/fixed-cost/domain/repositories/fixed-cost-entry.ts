import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntryEntity } from "@/features/fixed-cost/domain/entities/fixed-cost-entry";

export type ListFixedCostEntryByDateParams = {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
};

export type ListFixedCostEntryByDateResult = {
  entries: FixedCostEntryEntity[];
  meta: PaginationMeta;
};

export type ListFixedCostEntryParams = {
  fixedCostId: string;
  page?: number;
  limit?: number;
};

export type ListFixedCostEntryResult = {
  entries: FixedCostEntryEntity[];
  meta: PaginationMeta;
};

export type CreateFixedCostEntryParams = {
  fixedCostId: string;
  amount: number;
  startDate: string;
  endDate: string;
};

export type UpdateFixedCostEntryParams = {
  fixedCostId: string;
  entryId: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
};

export type DeleteFixedCostEntryParams = {
  fixedCostId: string;
  entryId: string;
};

export interface FixedCostEntryRepository {
  listByDate(params: ListFixedCostEntryByDateParams, session: SessionEntity): Promise<DataState<ListFixedCostEntryByDateResult>>;
  list(params: ListFixedCostEntryParams, session: SessionEntity): Promise<DataState<ListFixedCostEntryResult>>;
  create(params: CreateFixedCostEntryParams, session: SessionEntity): Promise<DataState<FixedCostEntryEntity>>;
  update(params: UpdateFixedCostEntryParams, session: SessionEntity): Promise<DataState<FixedCostEntryEntity>>;
  delete(params: DeleteFixedCostEntryParams, session: SessionEntity): Promise<DataState<void>>;
}
