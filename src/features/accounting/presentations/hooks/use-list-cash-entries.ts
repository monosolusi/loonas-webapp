"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashEntryRepositoryImpl } from "@/features/accounting/data/repositories/cash-entry";
import { CashEntryServiceImpl } from "@/features/accounting/data/sources/cash-entry";
import {
  ListCashEntriesUseCase,
  ListCashEntriesUseCaseParams,
} from "@/features/accounting/domain/usecases/list-cash-entries.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListCashEntriesFetcherParams,
  UseListCashEntriesReturnType,
} from "@/features/accounting/presentations/hooks/use-list-cash-entries.types";

const INITIAL_STATE: UseListCashEntriesReturnType = {
  entries: null,
  meta: null,
  loading: true,
  isLoadingPage: false,
  error: null,
  refresh: null,
};

async function ListCashEntryFetcher([_, fp]: [string, ListCashEntriesFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new CashEntryRepositoryImpl(new CashEntryServiceImpl(new HttpRequest()));
  const uc = new ListCashEntriesUseCase(repo, sessionRepo);
  const result = await uc.execute(fp.params);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListCashEntries(params: ListCashEntriesUseCaseParams = {}): UseListCashEntriesReturnType {
  const clerk = useClerk();
  const { data, isLoading, isValidating, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.LIST_CASH_ENTRIES, { clerk, params }],
    ListCashEntryFetcher,
    { keepPreviousData: true },
  );

  const swrError = error instanceof ServerError ? error : error ? new ServerError(ErrorCodes.UNKNOWN) : null;

  if (isLoading && !data) return INITIAL_STATE;
  if (swrError && !data) {
    return {
      entries: null,
      meta: null,
      loading: false,
      isLoadingPage: false,
      error: swrError,
      refresh: () => mutate(),
    };
  }
  if (!data) return INITIAL_STATE;

  return {
    entries: data.entries,
    meta: data.meta,
    loading: false,
    isLoadingPage: isValidating,
    error: swrError,
    refresh: mutate,
  };
}
