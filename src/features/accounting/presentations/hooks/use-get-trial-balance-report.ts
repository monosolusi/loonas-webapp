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
import { GetTrialBalanceReportUseCase } from "@/features/accounting/domain/usecases/get-trial-balance-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetTrialBalanceReportFetcherParams,
  UseGetTrialBalanceReportParams,
  UseGetTrialBalanceReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-trial-balance-report.types";

const INITIAL_STATE: UseGetTrialBalanceReportReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetTrialBalanceReportFetcher([_, params]: [string, GetTrialBalanceReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetTrialBalanceReportUseCase(repo, sessionRepo);
  const result = await uc.execute({ asOf: params.asOf, includeZero: params.includeZero });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetTrialBalanceReport(params: UseGetTrialBalanceReportParams): UseGetTrialBalanceReportReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_TRIAL_BALANCE_REPORT, { ...params, clerk }],
    GetTrialBalanceReportFetcher,
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
