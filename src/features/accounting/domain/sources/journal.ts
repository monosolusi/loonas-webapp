import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { WarningEntryModel } from "@/features/accounting/data/models/warning-entry";
import { PaginationMeta } from "@/core/resources/paginated";
import { ListJournalsParams, CreateJournalParams, GetJournalParams, ReverseJournalParams } from "@/features/accounting/domain/repositories/journal";

export type ListJournalsServiceResult = {
  data: JournalModel[];
  meta: PaginationMeta;
};

export type JournalWriteServiceResult = {
  journal: JournalModel;
  warnings: WarningEntryModel[];
};

export interface JournalService {
  list(params: ListJournalsParams, session: SessionEntity): Promise<ListJournalsServiceResult>;
  create(params: CreateJournalParams, session: SessionEntity): Promise<JournalWriteServiceResult>;
  get(params: GetJournalParams, session: SessionEntity): Promise<JournalModel>;
  reverse(params: ReverseJournalParams, session: SessionEntity): Promise<JournalWriteServiceResult>;
}
