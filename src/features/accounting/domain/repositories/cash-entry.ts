import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

export type ListCashEntriesParams = {
  page?: number;
  limit?: number;
  direction?: CashEntryDirection;
  dateFrom?: string;
  dateTo?: string;
};

export type ListCashEntriesResult = {
  entries: CashEntryEntity[];
  meta: PaginationMeta;
};

export type CreateCashEntryParams = {
  direction: CashEntryDirection;
  amount: number;
  categoryId: string;
  date: string;
  idempotencyKey: string;
  note?: string | null;
};

export type GetCashEntryParams = {
  id: string;
};

export type CancelCashEntryParams = {
  id: string;
  idempotencyKey: string;
  note?: string | null;
};

export interface CashEntryRepository {
  list(params: ListCashEntriesParams, session: SessionEntity): Promise<DataState<ListCashEntriesResult>>;
  create(params: CreateCashEntryParams, session: SessionEntity): Promise<DataState<CashEntryEntity>>;
  get(params: GetCashEntryParams, session: SessionEntity): Promise<DataState<CashEntryEntity>>;
  cancel(params: CancelCashEntryParams, session: SessionEntity): Promise<DataState<CashEntryEntity>>;
}
