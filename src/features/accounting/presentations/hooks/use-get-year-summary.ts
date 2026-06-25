"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountingPeriodRepositoryImpl } from "@/features/accounting/data/repositories/accounting-period";
import { AccountingPeriodServiceImpl } from "@/features/accounting/data/sources/accounting-period";
import { GetYearSummaryUseCase, GetYearSummaryUseCaseParams } from "@/features/accounting/domain/usecases/get-year-summary.usecases";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";

type FetcherParams = { clerk: ReturnType<typeof useClerk>; year: number };

async function GetAccountingYearSummaryFetcher([_, fp]: [string, FetcherParams]): Promise<YearEndSummaryEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new GetYearSummaryUseCase(repo, sessionRepo);
  const result = await uc.execute(new GetYearSummaryUseCaseParams(fp.year));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type ReturnType_ = {
  summary: YearEndSummaryEntity | null;
  loading: boolean;
  error: ServerError | null;
};

export function useGetYearSummary(year: number | null): ReturnType_ {
  const clerk = useClerk();
  const key = year != null ? [ACCOUNTING_SWR_KEYS.GET_ACCOUNTING_YEAR_SUMMARY, { clerk, year }] : null;
  const { data, isLoading, error } = useSWR(key, GetAccountingYearSummaryFetcher);

  return {
    summary: data ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
