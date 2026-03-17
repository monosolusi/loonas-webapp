import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";
import { LedgerEntryEntity } from "@/features/accounting/domain/entities/ledger-entry";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export type ListLedgerAccountsParams = {
  page?: number;
  limit?: number;
  search?: string;
  types?: AccountType[];
};

export type ListLedgerAccountsResult = {
  accounts: LedgerAccountEntity[];
  meta: PaginationMeta;
};

export type GetAccountBalanceParams = {
  startDate?: string;
  endDate?: string;
};

export type ListLedgerEntriesParams = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type ListLedgerEntriesResult = {
  entries: LedgerEntryEntity[];
  meta: PaginationMeta;
};

export interface LedgerAccountRepository {
  list(params: ListLedgerAccountsParams, session: SessionEntity): Promise<DataState<ListLedgerAccountsResult>>;
  getBalance(accountId: string, params: GetAccountBalanceParams, session: SessionEntity): Promise<DataState<AccountBalanceEntity>>;
  listEntries(accountId: string, params: ListLedgerEntriesParams, session: SessionEntity): Promise<DataState<ListLedgerEntriesResult>>;
}
