import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { ListCashEntriesUseCaseParams } from "@/features/accounting/domain/usecases/list-cash-entries.usecases";

export type ListCashEntriesFetcherParams = {
  readonly clerk: ReturnType<typeof useClerk>;
  readonly params: ListCashEntriesUseCaseParams;
};

type InitialState = {
  readonly entries: null;
  readonly meta: null;
  readonly loading: true;
  readonly error: null;
};

type LoadedState = {
  readonly entries: CashEntryEntity[];
  readonly meta: PaginationMeta;
  readonly loading: false;
  readonly error: null;
};

type ErrorState = {
  readonly entries: null;
  readonly meta: null;
  readonly loading: false;
  readonly error: ServerError;
};

export type UseListCashEntriesReturnType = InitialState | LoadedState | ErrorState;
