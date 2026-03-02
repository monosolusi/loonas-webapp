import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DashboardRepository } from "@/features/dashboard/domain/repositories/dashboard";
import { DashboardService } from "@/features/dashboard/domain/sources/dashboard";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";

export class DashboardRepositoryImpl implements DashboardRepository {
  constructor(private readonly dashboardService: DashboardService) {}

  public async getStatistics(session: SessionEntity): Promise<DataState<DashboardStatisticsEntity>> {
    try {
      const statistics = await this.dashboardService.getStatistics(session);
      return new DataSuccess(statistics.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
