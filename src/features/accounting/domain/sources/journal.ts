import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { WarningEntryModel } from "@/features/accounting/data/models/warning-entry";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListJournalsServiceParams = {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type CreateJournalLineServiceInput = {
  accountId: string;
  debit: number;
  credit: number;
};

export type CreateJournalServiceParams = {
  postingDate: string;
  memo: string;
  lines: CreateJournalLineServiceInput[];
  acknowledgedWarningCodes?: string[];
  idempotencyKey?: string;
};

export type GetJournalServiceParams = {
  id: string;
};

export type ReverseJournalServiceParams = {
  id: string;
  changeReasonCategory: string;
  changeReasonDetail: string;
  postingDate?: string;
  acknowledgedWarningCodes?: string[];
  idempotencyKey?: string;
};

export type ListJournalsServiceResult = {
  data: JournalModel[];
  meta: PaginationMeta;
};

export type JournalWriteServiceResult = {
  journal: JournalModel;
  warnings: WarningEntryModel[];
};

export interface JournalService {
  list(params: ListJournalsServiceParams, session: SessionEntity): Promise<ListJournalsServiceResult>;
  create(params: CreateJournalServiceParams, session: SessionEntity): Promise<JournalWriteServiceResult>;
  get(params: GetJournalServiceParams, session: SessionEntity): Promise<JournalModel>;
  reverse(params: ReverseJournalServiceParams, session: SessionEntity): Promise<JournalWriteServiceResult>;
}
