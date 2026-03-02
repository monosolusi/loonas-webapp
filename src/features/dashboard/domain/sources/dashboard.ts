import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DashboardStatisticsModel } from "@/features/dashboard/data/models/dashboard-statistics";

export interface DashboardService {
  getStatistics(session: SessionEntity): Promise<DashboardStatisticsModel>;
}
