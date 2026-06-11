"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DashboardRepositoryImpl } from "@/features/dashboard/data/repositories/dashboard";
import { DashboardServiceImpl } from "@/features/dashboard/data/sources/dashboard";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { GetDashboardStatisticsUseCase } from "@/features/dashboard/domain/usecases/get-dashboard-statistics.usecases";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import useSWR from "swr";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { useClerk } from "@clerk/nextjs";
import {
  GetDashboardStatisticsFetcherParams,
  UseGetDashboardStatisticsReturnType,
} from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics.types";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

const INITIAL_STATE: UseGetDashboardStatisticsReturnType = {
  statistics: null,
  loading: true,
  error: null,
};

async function GetDashboardStatisticsFetcher([_key, _from, _to, params]: [
  string,
  string | undefined,
  string | undefined,
  GetDashboardStatisticsFetcherParams,
]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const dashboardRepository = new DashboardRepositoryImpl(new DashboardServiceImpl(new HttpRequest()));

  const get = new GetDashboardStatisticsUseCase(dashboardRepository, sessionRepository);

  const result = await get.execute({ from: params.from, to: params.to });
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);

  return result.data;
}

type UseGetDashboardStatisticsParams = {
  from?: string;
  to?: string;
};

export function useGetDashboardStatistics(params: UseGetDashboardStatisticsParams = {}): UseGetDashboardStatisticsReturnType {
  const clerk = useClerk();

  const { data, isLoading, error } = useSWR(
    [DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS, params.from, params.to, { clerk, from: params.from, to: params.to }] as const,
    GetDashboardStatisticsFetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
      keepPreviousData: true,
    },
  );

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      statistics: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return INITIAL_STATE;

  return {
    statistics: data,
    loading: false,
    error: null,
  };
}
