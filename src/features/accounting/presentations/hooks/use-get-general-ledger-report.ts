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
import { GetGeneralLedgerReportUseCase } from "@/features/accounting/domain/usecases/get-general-ledger-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetGeneralLedgerReportFetcherParams,
  UseGetGeneralLedgerReportParams,
  UseGetGeneralLedgerReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-general-ledger-report.types";

const INITIAL_STATE: UseGetGeneralLedgerReportReturnType = {
  data: null,
  loading: true,
  isLoadingPage: false,
  error: null,
  refresh: null,
};

async function GetGeneralLedgerReportFetcher([_, params]: [string, GetGeneralLedgerReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetGeneralLedgerReportUseCase(repo, sessionRepo);
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

export function useGetGeneralLedgerReport(
  params: UseGetGeneralLedgerReportParams,
): UseGetGeneralLedgerReportReturnType {
  const clerk = useClerk();
  const enabled = params.enabled !== false;
  const { data, isLoading, isValidating, error, mutate } = useSWR(
    enabled ? [ACCOUNTING_SWR_KEYS.GET_GENERAL_LEDGER_REPORT, { ...params, clerk }] : null,
    GetGeneralLedgerReportFetcher,
    { keepPreviousData: true },
  );

  if (isLoading && !data) return INITIAL_STATE;
  if (error && !data) {
    return {
      data: null,
      loading: false,
      isLoadingPage: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }
  if (!data) return INITIAL_STATE;

  return {
    data,
    loading: false,
    isLoadingPage: isValidating,
    error: null,
    refresh: mutate,
  };
}
