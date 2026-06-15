import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";

export type ListJournalsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListJournalsResult = {
  journals: JournalEntity[];
  meta: PaginationMeta;
};

export type CreateJournalLineInput = {
  accountId: string;
  debit: number;
  credit: number;
};

export type CreateJournalParams = {
  postingDate: string;
  memo: string;
  lines: CreateJournalLineInput[];
  acknowledgedWarningCodes?: string[];
};

export type GetJournalParams = {
  id: string;
};

export type ReverseJournalParams = {
  id: string;
  changeReasonCategory: string;
  changeReasonDetail: string;
  postingDate?: string;
  acknowledgedWarningCodes?: string[];
};

export type JournalWriteResult = {
  journal: JournalEntity;
  warnings: WarningEntryEntity[];
};

export interface JournalRepository {
  list(params: ListJournalsParams, session: SessionEntity): Promise<DataState<ListJournalsResult>>;
  create(params: CreateJournalParams, session: SessionEntity): Promise<DataState<JournalWriteResult>>;
  get(params: GetJournalParams, session: SessionEntity): Promise<DataState<JournalEntity>>;
  reverse(params: ReverseJournalParams, session: SessionEntity): Promise<DataState<JournalWriteResult>>;
}
