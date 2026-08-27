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
import { ListCostValuationGapsUseCase } from "@/features/accounting/domain/usecases/list-cost-valuation-gaps.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import {
  ListCostValuationGapsFetcherParams,
  UseListCostValuationGapsParams,
  UseListCostValuationGapsReturnType,
} from "@/features/accounting/presentations/hooks/use-list-cost-valuation-gaps.types";

async function ListCostValuationGapsFetcher([_, params]: [string, ListCostValuationGapsFetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new ReportRepositoryImpl(new ReportServiceImpl(new HttpRequest()));
  const uc = new ListCostValuationGapsUseCase(repo, sessionRepo);
  const result = await uc.execute({
    from: params.from,
    to: params.to,
    page: params.page,
    limit: params.limit,
  });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListCostValuationGaps(
  params: UseListCostValuationGapsParams,
): UseListCostValuationGapsReturnType {
  const clerk = useClerk();
  const enabled = params.enabled !== false;
  const { data, isLoading, isValidating, error, mutate } = useSWR(
    enabled ? [ACCOUNTING_SWR_KEYS.LIST_COST_VALUATION_GAPS_REPORT, { ...params, clerk }] : null,
    ListCostValuationGapsFetcher,
    { keepPreviousData: true },
  );

  const swrError = error instanceof ServerError ? error : error ? new ServerError(ErrorCodes.UNKNOWN) : null;

  const initialState: UseListCostValuationGapsReturnType = {
    data: null,
    loading: true,
    isLoadingPage: false,
    error: null,
    refresh: mutate,
  };

  if (isLoading && !data) return initialState;
  if (swrError && !data) {
    return {
      data: null,
      loading: false,
      isLoadingPage: false,
      error: swrError,
      refresh: mutate,
    };
  }
  if (!data) return initialState;

  return {
    data,
    loading: false,
    isLoadingPage: isValidating,
    error: swrError,
    refresh: mutate,
  };
}