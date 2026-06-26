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
  accountId: string;
  startDate?: string;
  endDate?: string;
};

export type ListLedgerEntriesParams = {
  accountId: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type ListLedgerEntriesResult = {
  entries: LedgerEntryEntity[];
  meta: PaginationMeta;
};

export type CreateLedgerAccountParams = {
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  idempotencyKey: string;
};

export type UpdateLedgerAccountParams = {
  id: string;
  name?: string;
  code?: string;
  type?: AccountType;
  // undefined = omit (unchanged), null = clear parent, { id } = set new parent
  parent?: { id: string } | null;
};

export type DeleteLedgerAccountParams = {
  id: string;
};

export interface LedgerAccountRepository {
  list(params: ListLedgerAccountsParams, session: SessionEntity): Promise<DataState<ListLedgerAccountsResult>>;
  getBalance(params: GetAccountBalanceParams, session: SessionEntity): Promise<DataState<AccountBalanceEntity>>;
  listEntries(params: ListLedgerEntriesParams, session: SessionEntity): Promise<DataState<ListLedgerEntriesResult>>;
  create(params: CreateLedgerAccountParams, session: SessionEntity): Promise<DataState<LedgerAccountEntity>>;
  update(params: UpdateLedgerAccountParams, session: SessionEntity): Promise<DataState<LedgerAccountEntity>>;
  delete(params: DeleteLedgerAccountParams, session: SessionEntity): Promise<DataState<void>>;
}
