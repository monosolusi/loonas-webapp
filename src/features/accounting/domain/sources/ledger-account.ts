import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import { AccountBalanceModel } from "@/features/accounting/data/models/account-balance";
import { LedgerEntryModel } from "@/features/accounting/data/models/ledger-entry";
import { PaginationMeta } from "@/core/resources/paginated";
import {
  ListLedgerAccountsParams,
  GetAccountBalanceParams,
  ListLedgerEntriesParams,
  CreateLedgerAccountParams,
  UpdateLedgerAccountParams,
  DeleteLedgerAccountParams,
} from "@/features/accounting/domain/repositories/ledger-account";

export type ListLedgerAccountsServiceResult = {
  data: LedgerAccountModel[];
  meta: PaginationMeta;
};

export type ListLedgerEntriesServiceResult = {
  data: LedgerEntryModel[];
  meta: PaginationMeta;
};

export interface LedgerAccountService {
  list(params: ListLedgerAccountsParams, session: SessionEntity): Promise<ListLedgerAccountsServiceResult>;
  getBalance(accountId: string, params: GetAccountBalanceParams, session: SessionEntity): Promise<AccountBalanceModel>;
  listEntries(accountId: string, params: ListLedgerEntriesParams, session: SessionEntity): Promise<ListLedgerEntriesServiceResult>;
  create(params: CreateLedgerAccountParams, session: SessionEntity): Promise<LedgerAccountModel>;
  update(params: UpdateLedgerAccountParams, session: SessionEntity): Promise<LedgerAccountModel>;
  delete(params: DeleteLedgerAccountParams, session: SessionEntity): Promise<void>;
}
