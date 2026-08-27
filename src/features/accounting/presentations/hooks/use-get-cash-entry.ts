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
  RetrieveCashEntryUseCase,
  RetrieveCashEntryUseCaseParams,
} from "@/features/accounting/domain/usecases/retrieve-cash-entry.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetCashEntryFetcherParams,
  UseGetCashEntryReturnType,
} from "@/features/accounting/presentations/hooks/use-get-cash-entry.types";

const INITIAL_STATE: UseGetCashEntryReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetCashEntryFetcher([_, params]: [string, GetCashEntryFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new CashEntryRepositoryImpl(new CashEntryServiceImpl(new HttpRequest()));
  const uc = new RetrieveCashEntryUseCase(repo, sessionRepo);
  const result = await uc.execute(new RetrieveCashEntryUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetCashEntry(id: string): UseGetCashEntryReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_CASH_ENTRY, { id, clerk }],
    GetCashEntryFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: mutate,
    };
  }
  if (!data) return INITIAL_STATE;

  return {
    data,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
