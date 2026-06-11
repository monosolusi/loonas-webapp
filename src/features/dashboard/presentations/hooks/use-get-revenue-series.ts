"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { DashboardRepositoryImpl } from "@/features/dashboard/data/repositories/dashboard";
import { DashboardServiceImpl } from "@/features/dashboard/data/sources/dashboard";
import { GetRevenueSeriesUseCase } from "@/features/dashboard/domain/usecases/get-revenue-series.usecases";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";
import {
  GetRevenueSeriesFetcherParams,
  UseGetRevenueSeriesReturnType,
} from "@/features/dashboard/presentations/hooks/use-get-revenue-series.types";

const INITIAL_STATE: UseGetRevenueSeriesReturnType = {
  series: null,
  loading: true,
  error: null,
};

async function ListRevenueSeriesFetcher([_key, _from, _to, params]: [
  string,
  string,
  string,
  GetRevenueSeriesFetcherParams,
]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const dashboardRepository = new DashboardRepositoryImpl(new DashboardServiceImpl(new HttpRequest()));
  const useCase = new GetRevenueSeriesUseCase(dashboardRepository, sessionRepository);

  const result = await useCase.execute({ from: params.from, to: params.to });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

type UseGetRevenueSeriesParams = {
  from: string;
  to: string;
};

export function useGetRevenueSeries({ from, to }: UseGetRevenueSeriesParams): UseGetRevenueSeriesReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [DASHBOARD_SWR_KEYS.DASHBOARD_REVENUE_SERIES, from, to, { clerk, from, to }],
    ListRevenueSeriesFetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
      keepPreviousData: true,
    },
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      series: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    series: data,
    loading: false,
    error: null,
  };
}
