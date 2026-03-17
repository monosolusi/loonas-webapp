import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { PaginationMeta } from "@/core/resources/paginated";
import { ListJournalsParams } from "@/features/accounting/domain/repositories/journal";

export type ListJournalsServiceResult = {
  data: JournalModel[];
  meta: PaginationMeta;
};

export interface JournalService {
  list(params: ListJournalsParams, session: SessionEntity): Promise<ListJournalsServiceResult>;
}
