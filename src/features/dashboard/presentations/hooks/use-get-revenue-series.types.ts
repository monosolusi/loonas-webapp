import { useClerk } from "@clerk/nextjs";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";
import { ServerError } from "@/core/resources/server-error";

export type GetRevenueSeriesFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  from: string;
  to: string;
};

type InitialState = {
  series: null;
  loading: true;
  error: null;
};

type LoadedState = {
  series: DailyRevenuePoint[];
  loading: false;
  error: null;
};

type ErrorState = {
  series: null;
  loading: false;
  error: ServerError;
};

export type UseGetRevenueSeriesReturnType = InitialState | LoadedState | ErrorState;
