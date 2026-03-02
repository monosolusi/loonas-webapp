import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DashboardStatisticsModel } from "@/features/dashboard/data/models/dashboard-statistics";
import { DashboardService } from "@/features/dashboard/domain/sources/dashboard";
import { HttpRequest } from "@/core/helpers/http-request";

export class DashboardServiceImpl implements DashboardService {
  constructor(private readonly http: HttpRequest) {}

  public async getStatistics(session: SessionEntity): Promise<DashboardStatisticsModel> {
    try {
      const path = "/dashboard";
      const method = "GET";

      const result = await this.http.request({ path, method, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return DashboardStatisticsModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
