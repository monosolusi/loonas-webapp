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
import { GetBalanceSheetReportUseCase } from "@/features/accounting/domain/usecases/get-balance-sheet-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetBalanceSheetReportFetcherParams,
  UseGetBalanceSheetReportParams,
  UseGetBalanceSheetReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-balance-sheet-report.types";

async function GetBalanceSheetReportFetcher([_, params]: [string, GetBalanceSheetReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetBalanceSheetReportUseCase(repo, sessionRepo);
  const result = await uc.execute({ asOf: params.asOf, compareTo: params.compareTo });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetBalanceSheetReport(params: UseGetBalanceSheetReportParams): UseGetBalanceSheetReportReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_BALANCE_SHEET_REPORT, { ...params, clerk }],
    GetBalanceSheetReportFetcher,
  );

  const initialState: UseGetBalanceSheetReportReturnType = {
    data: null,
    loading: true,
    error: null,
    refresh: mutate,
  };

  if (isLoading) return initialState;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: mutate,
    };
  }
  if (!data) return initialState;

  return {
    data,
    loading: false,
    error: null,
    refresh: mutate,
  };
}
