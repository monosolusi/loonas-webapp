"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { ReportRepositoryImpl } from "@/features/accounting/data/repositories/report";
import { ReportServiceImpl } from "@/features/accounting/data/sources/report";
import { ListTrialBalanceLinesUseCase } from "@/features/accounting/domain/usecases/list-trial-balance-lines.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListTrialBalanceLineFetcherParams,
  UseListTrialBalanceLinesParams,
  UseListTrialBalanceLinesReturnType,
} from "@/features/accounting/presentations/hooks/use-list-trial-balance-lines.types";

const INITIAL_STATE: UseListTrialBalanceLinesReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function ListTrialBalanceLineFetcher([_, params]: [string, ListTrialBalanceLineFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new ListTrialBalanceLinesUseCase(repo, sessionRepo);
  const result = await uc.execute({
    accountId: params.accountId,
    from: params.from,
    to: params.to,
    page: params.page,
    limit: params.limit,
  });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListTrialBalanceLines(
  params: UseListTrialBalanceLinesParams,
): UseListTrialBalanceLinesReturnType {
  const clerk = useClerk();
  const enabled = params.enabled !== false;
  const { data, isLoading, error, mutate } = useSWR(
    enabled ? [ACCOUNTING_SWR_KEYS.LIST_TRIAL_BALANCE_LINES, { ...params, clerk }] : null,
    ListTrialBalanceLineFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
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
