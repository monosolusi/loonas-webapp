import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";

export interface GetStatisticsParams {
  from?: string;
  to?: string;
}

export interface DashboardRepository {
  getStatistics(params: GetStatisticsParams, session: SessionEntity): Promise<DataState<DashboardStatisticsEntity>>;
  getRevenueSeries(params: { from: string; to: string }, session: SessionEntity): Promise<DataState<DailyRevenuePoint[]>>;
}
