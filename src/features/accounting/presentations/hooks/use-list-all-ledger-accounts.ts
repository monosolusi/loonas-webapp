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
import { ListAllLedgerAccountsUseCase } from "@/features/accounting/domain/usecases/list-all-ledger-accounts.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { UseListAllLedgerAccountsReturnType } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts.types";

const INITIAL_STATE: UseListAllLedgerAccountsReturnType = { accounts: null, loading: true, error: null };

type Clerk = ReturnType<typeof useClerk>;

async function ListAllLedgerAccountFetcher([_, { clerk }]: [string, { clerk: Clerk }]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const repo = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const uc = new ListAllLedgerAccountsUseCase(repo, sessionRepo);
  const result = await uc.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListAllLedgerAccounts(): UseListAllLedgerAccountsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR([ACCOUNTING_SWR_KEYS.LIST_ALL_LEDGER_ACCOUNTS, { clerk }], ListAllLedgerAccountFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      accounts: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { accounts: data.accounts, loading: false, error: null };
}
