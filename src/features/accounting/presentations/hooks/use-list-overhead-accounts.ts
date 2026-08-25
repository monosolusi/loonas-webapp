"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { OverheadAccountRepositoryImpl } from "@/features/accounting/data/repositories/overhead-account";
import { OverheadAccountServiceImpl } from "@/features/accounting/data/sources/overhead-account";
import { ListOverheadAccountsUseCase } from "@/features/accounting/domain/usecases/list-overhead-accounts.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { UseListOverheadAccountsReturnType } from "@/features/accounting/presentations/hooks/use-list-overhead-accounts.types";

const INITIAL_STATE: UseListOverheadAccountsReturnType = { selections: null, loading: true, error: null };

type Clerk = ReturnType<typeof useClerk>;

async function ListOverheadAccountsFetcher([_, { clerk }]: [string, { clerk: Clerk }]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const repo = new OverheadAccountRepositoryImpl(new OverheadAccountServiceImpl(new HttpRequest()));
  const uc = new ListOverheadAccountsUseCase(repo, sessionRepo);
  const result = await uc.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListOverheadAccounts(): UseListOverheadAccountsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [ACCOUNTING_SWR_KEYS.LIST_OVERHEAD_ACCOUNTS, { clerk }],
    ListOverheadAccountsFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      selections: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }
  if (!data) return INITIAL_STATE;

  return { selections: data, loading: false, error: null };
}
