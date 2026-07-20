"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { LedgerAccountRepositoryImpl } from "@/features/accounting/data/repositories/ledger-account";
import { LedgerAccountServiceImpl } from "@/features/accounting/data/sources/ledger-account";
import { ListLedgerAccountsUseCase } from "@/features/accounting/domain/usecases/list-ledger-accounts.usecases";
import { ListLedgerAccountsParams } from "@/features/accounting/domain/repositories/ledger-account";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListLedgerAccountFetcherParams,
  UseListLedgerAccountsReturnType,
} from "@/features/accounting/presentations/hooks/use-list-ledger-accounts.types";

const INITIAL_STATE: UseListLedgerAccountsReturnType = { accounts: null, meta: null, loading: true, error: null };

async function ListLedgerAccountFetcher([_, fp]: [string, ListLedgerAccountFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListLedgerAccountsUseCase(repo, sessionRepo);
  const result = await uc.execute({
    page: fp.params.page,
    limit: fp.params.limit,
    search: fp.params.search,
    types: fp.params.types,
    startDate: fp.params.startDate,
    endDate: fp.params.endDate,
  });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListLedgerAccounts(params: ListLedgerAccountsParams = {}): UseListLedgerAccountsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([ACCOUNTING_SWR_KEYS.LIST_LEDGER_ACCOUNTS, { clerk, params }], ListLedgerAccountFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      accounts: null,
      meta: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { accounts: data.accounts, meta: data.meta, loading: false, error: null };
}
