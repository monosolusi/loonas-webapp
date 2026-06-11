import { useClerk } from "@clerk/nextjs";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { ServerError } from "@/core/resources/server-error";

export type GetDashboardStatisticsFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  from?: string;
  to?: string;
};

type InitialState = {
  statistics: null;
  loading: true;
  error: null;
};

type LoadedState = {
  statistics: DashboardStatisticsEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  statistics: null;
  loading: false;
  error: ServerError;
};

export type UseGetDashboardStatisticsReturnType = InitialState | LoadedState | ErrorState;
