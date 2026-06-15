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
import { GetArusKasReportUseCase } from "@/features/accounting/domain/usecases/get-arus-kas-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetArusKasReportFetcherParams,
  UseGetArusKasReportParams,
  UseGetArusKasReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-arus-kas-report.types";

const INITIAL_STATE: UseGetArusKasReportReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetArusKasReportFetcher([_, params]: [string, GetArusKasReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetArusKasReportUseCase(repo, sessionRepo);
  const result = await uc.execute({ from: params.from, to: params.to });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetArusKasReport(params: UseGetArusKasReportParams): UseGetArusKasReportReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_ARUS_KAS_REPORT, { ...params, clerk }],
    GetArusKasReportFetcher,
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
