import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { ListCashEntriesUseCaseParams, ListCashEntriesUseCaseResult } from "@/features/accounting/domain/usecases/list-cash-entries.usecases";

export type ListCashEntriesFetcherParams = {
  readonly clerk: ReturnType<typeof useClerk>;
  readonly params: ListCashEntriesUseCaseParams;
};

type InitialState = {
  readonly entries: null;
  readonly meta: null;
  readonly loading: true;
  readonly isLoadingPage: false;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly entries: CashEntryEntity[];
  readonly meta: PaginationMeta;
  readonly loading: false;
  readonly isLoadingPage: boolean;
  readonly error: ServerError | null;
  readonly refresh: KeyedMutator<ListCashEntriesUseCaseResult>;
};

type ErrorState = {
  readonly entries: null;
  readonly meta: null;
  readonly loading: false;
  readonly isLoadingPage: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<ListCashEntriesUseCaseResult>;
};

export type UseListCashEntriesReturnType = InitialState | LoadedState | ErrorState;
