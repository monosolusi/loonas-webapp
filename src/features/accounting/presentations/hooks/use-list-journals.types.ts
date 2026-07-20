import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { ListJournalsParams } from "@/features/accounting/domain/repositories/journal";

export type ListJournalsFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: ListJournalsParams;
};

type InitialState = {
  journals: null;
  meta: null;
  totalDebit: number;
  totalCredit: number;
  loading: true;
  error: null;
};

type LoadedState = {
  journals: JournalEntity[];
  meta: PaginationMeta;
  totalDebit: number;
  totalCredit: number;
  loading: false;
  error: null;
};

type ErrorState = {
  journals: null;
  meta: null;
  totalDebit: number;
  totalCredit: number;
  loading: false;
  error: ServerError;
};

export type UseListJournalsReturnType = InitialState | LoadedState | ErrorState;
