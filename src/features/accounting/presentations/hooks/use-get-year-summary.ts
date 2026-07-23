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
import { GetYearSummaryUseCase } from "@/features/accounting/domain/usecases/get-year-summary.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  GetYearSummaryFetcherParams,
  UseGetYearSummaryReturnType,
} from "@/features/accounting/presentations/hooks/use-get-year-summary.types";

const INITIAL_STATE: UseGetYearSummaryReturnType = { summary: null, loading: true, error: null };

async function GetAccountingYearSummaryFetcher([_, fp]: [string, GetYearSummaryFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fp.clerk }));
  const repo = new AccountingPeriodRepositoryImpl(new AccountingPeriodServiceImpl(new HttpRequest()));
  const uc = new GetYearSummaryUseCase(repo, sessionRepo);
  const result = await uc.execute({ year: fp.year });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetYearSummary(year: number | null): UseGetYearSummaryReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    year != null ? [ACCOUNTING_SWR_KEYS.GET_ACCOUNTING_YEAR_SUMMARY, { clerk, year }] : null,
    GetAccountingYearSummaryFetcher,
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return { summary: null, loading: false, error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN) };
  }
  if (!data) return INITIAL_STATE;

  return { summary: data, loading: false, error: null };
}
