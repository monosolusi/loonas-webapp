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
import { GetIncomeStatementReportUseCase } from "@/features/accounting/domain/usecases/get-income-statement-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetIncomeStatementReportFetcherParams,
  UseGetIncomeStatementReportParams,
  UseGetIncomeStatementReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-income-statement-report.types";

async function GetIncomeStatementReportFetcher([_, params]: [string, GetIncomeStatementReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetIncomeStatementReportUseCase(repo, sessionRepo);
  const result = await uc.execute({
    from: params.from,
    to: params.to,
    compareFrom: params.compareFrom,
    compareTo: params.compareTo,
  });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetIncomeStatementReport(
  params: UseGetIncomeStatementReportParams,
): UseGetIncomeStatementReportReturnType {
  const clerk = useClerk();
  const { from, to, compareFrom, compareTo } = params;
  const { data, isLoading, error, mutate } = useSWR(
    params.enabled
      ? [ACCOUNTING_SWR_KEYS.GET_INCOME_STATEMENT_REPORT, { from, to, compareFrom, compareTo, clerk }]
      : null,
    GetIncomeStatementReportFetcher,
  );

  const initialState: UseGetIncomeStatementReportReturnType = {
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
