import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DashboardStatisticsModel } from "@/features/dashboard/data/models/dashboard-statistics";
import { DailyRevenuePointModel } from "@/features/dashboard/data/models/daily-revenue-point";

export interface GetStatisticsServiceParams {
  from?: string;
  to?: string;
}

export interface DashboardService {
  getStatistics(params: GetStatisticsServiceParams, session: SessionEntity): Promise<DashboardStatisticsModel>;
  getRevenueSeries(params: { from: string; to: string }, session: SessionEntity): Promise<DailyRevenuePointModel[]>;
}
