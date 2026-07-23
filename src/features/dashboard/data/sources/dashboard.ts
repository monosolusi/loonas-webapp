import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DashboardStatisticsModel } from "@/features/dashboard/data/models/dashboard-statistics";
import { DailyRevenuePointModel } from "@/features/dashboard/data/models/daily-revenue-point";
import { DashboardService, GetStatisticsServiceParams } from "@/features/dashboard/domain/sources/dashboard";
import { HttpRequest } from "@/core/helpers/http-request";

export class DashboardServiceImpl implements DashboardService {
  constructor(private readonly http: HttpRequest) {}

  public async getStatistics(
    params: GetStatisticsServiceParams,
    session: SessionEntity,
  ): Promise<DashboardStatisticsModel> {
    try {
      const searchParams: Record<string, string> = {};
      if (params.from && params.to) {
        searchParams["start_date"] = params.from;
        searchParams["end_date"] = params.to;
      }

      const result = await this.http.request({
        path: "/dashboard",
        method: "GET",
        session,
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return DashboardStatisticsModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getRevenueSeries(
    params: { from: string; to: string },
    session: SessionEntity,
  ): Promise<DailyRevenuePointModel[]> {
    try {
      const result = await this.http.request({
        path: "/dashboard/revenue-series",
        method: "GET",
        session,
        searchParams: { start_date: params.from, end_date: params.to },
      });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      const series: Record<string, any>[] = Array.isArray(result["revenue_series"])
        ? result["revenue_series"]
        : [];
      return series.map((item) => DailyRevenuePointModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
