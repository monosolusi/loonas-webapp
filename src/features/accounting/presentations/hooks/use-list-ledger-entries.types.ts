import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";

export type UseListLedgerEntriesParams = {
  accountId: string | null;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type ListLedgerEntriesFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  accountId: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

type InitialState = {
  entries: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  entries: LedgerEntryEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  entries: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListLedgerEntriesReturnType = InitialState | LoadedState | ErrorState;
