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
import { GetNeracaReportUseCase } from "@/features/accounting/domain/usecases/get-neraca-report.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetNeracaReportFetcherParams,
  UseGetNeracaReportParams,
  UseGetNeracaReportReturnType,
} from "@/features/accounting/presentations/hooks/use-get-neraca-report.types";

const INITIAL_STATE: UseGetNeracaReportReturnType = {
  data: null,
  loading: true,
  error: null,
  refresh: null,
};

async function GetNeracaReportFetcher([_, params]: [string, GetNeracaReportFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new GetNeracaReportUseCase(repo, sessionRepo);
  const result = await uc.execute({ asOf: params.asOf, compareTo: params.compareTo });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetNeracaReport(params: UseGetNeracaReportParams): UseGetNeracaReportReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(
    [ACCOUNTING_SWR_KEYS.GET_NERACA_REPORT, { ...params, clerk }],
    GetNeracaReportFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: () => mutate(),
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
