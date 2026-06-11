import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DashboardRepository, GetStatisticsParams } from "@/features/dashboard/domain/repositories/dashboard";
import { DashboardService } from "@/features/dashboard/domain/sources/dashboard";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";

export class DashboardRepositoryImpl implements DashboardRepository {
  constructor(private readonly dashboardService: DashboardService) {}

  public async getStatistics(
    params: GetStatisticsParams,
    session: SessionEntity,
  ): Promise<DataState<DashboardStatisticsEntity>> {
    try {
      const statistics = await this.dashboardService.getStatistics(params, session);
      return new DataSuccess(statistics.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getRevenueSeries(
    params: { from: string; to: string },
    session: SessionEntity,
  ): Promise<DataState<DailyRevenuePoint[]>> {
    try {
      const models = await this.dashboardService.getRevenueSeries(params, session);
      return new DataSuccess(models.map((m) => m.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
