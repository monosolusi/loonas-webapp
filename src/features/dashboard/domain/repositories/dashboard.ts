import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";

export interface DashboardRepository {
  getStatistics(session: SessionEntity): Promise<DataState<DashboardStatisticsEntity>>;
}
