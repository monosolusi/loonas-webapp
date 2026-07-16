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
import { GetCashFlowReportUseCase } from "@/features/accounting/domain/usecases/get-cash-flow-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetCashFlowReportFetcherParams,
  UseGetCashFlowReportParams,
  UseGetCashFlowReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-cash-flow-report.types";

const INITIAL_STATE: UseGetCashFlowReportReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetCashFlowReportFetcher([_, params]: [string, GetCashFlowReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetCashFlowReportUseCase(repo, sessionRepo);
  const result = await uc.execute({ from: params.from, to: params.to });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetCashFlowReport(params: UseGetCashFlowReportParams): UseGetCashFlowReportReturnType {
  const clerk = useClerk();
  const { from, to } = params;
  const { data, isLoading, error, mutate } = useSWR(
    params.enabled ? [ACCOUNTING_SWR_KEYS.GET_CASH_FLOW_REPORT, { from, to, clerk }] : null,
    GetCashFlowReportFetcher,
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
