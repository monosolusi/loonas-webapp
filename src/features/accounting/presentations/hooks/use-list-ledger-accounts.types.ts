import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ListLedgerAccountsParams } from "@/features/accounting/domain/repositories/ledger-account";

export type ListLedgerAccountFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: ListLedgerAccountsParams;
};

type InitialState = {
  accounts: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  accounts: LedgerAccountEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  accounts: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListLedgerAccountsReturnType = InitialState | LoadedState | ErrorState;
