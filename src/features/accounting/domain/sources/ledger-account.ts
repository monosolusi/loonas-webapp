import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import { AccountBalanceModel } from "@/features/accounting/data/models/account-balance";
import { LedgerEntryModel } from "@/features/accounting/data/models/ledger-entry";
import { PaginationMeta } from "@/core/resources/paginated";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export type ListLedgerAccountsServiceParams = {
  page?: number;
  limit?: number;
  search?: string;
  types?: AccountType[];
  startDate?: string;
  endDate?: string;
};

export type GetAccountBalanceServiceParams = {
  accountId: string;
  startDate?: string;
  endDate?: string;
};

export type ListLedgerEntriesServiceParams = {
  accountId: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type CreateLedgerAccountServiceParams = {
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  idempotencyKey: string;
};

export type UpdateLedgerAccountServiceParams = {
  id: string;
  name?: string;
  code?: string;
  type?: AccountType;
  // undefined = omit (unchanged), null = clear parent, { id } = set new parent
  parent?: { id: string } | null;
};

export type DeleteLedgerAccountServiceParams = {
  id: string;
};

export type ListLedgerAccountsServiceResult = {
  data: LedgerAccountModel[];
  meta: PaginationMeta;
};

export type ListLedgerEntriesServiceResult = {
  data: LedgerEntryModel[];
  meta: PaginationMeta;
};

export interface LedgerAccountService {
  list(params: ListLedgerAccountsServiceParams, session: SessionEntity): Promise<ListLedgerAccountsServiceResult>;
  getBalance(params: GetAccountBalanceServiceParams, session: SessionEntity): Promise<AccountBalanceModel>;
  listEntries(params: ListLedgerEntriesServiceParams, session: SessionEntity): Promise<ListLedgerEntriesServiceResult>;
  create(params: CreateLedgerAccountServiceParams, session: SessionEntity): Promise<LedgerAccountModel>;
  update(params: UpdateLedgerAccountServiceParams, session: SessionEntity): Promise<LedgerAccountModel>;
  delete(params: DeleteLedgerAccountServiceParams, session: SessionEntity): Promise<void>;
}
