import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

export type ListJournalsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListJournalsResult = {
  journals: JournalEntity[];
  meta: PaginationMeta;
};

export interface JournalRepository {
  list(params: ListJournalsParams, session: SessionEntity): Promise<DataState<ListJournalsResult>>;
}
