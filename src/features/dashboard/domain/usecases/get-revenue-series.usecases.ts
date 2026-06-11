import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";
import { DashboardRepository } from "@/features/dashboard/domain/repositories/dashboard";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export type GetRevenueSeriesParams = {
  from: string;
  to: string;
};

export class GetRevenueSeriesUseCase implements UseCase<DataState<DailyRevenuePoint[]>, GetRevenueSeriesParams> {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetRevenueSeriesParams): Promise<DataState<DailyRevenuePoint[]>> {
    try {
      const session = await this.resolveSession();
      return this.fetchRevenueSeries(params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }

  private fetchRevenueSeries(params: GetRevenueSeriesParams, session: SessionEntity) {
    return this.dashboardRepository.getRevenueSeries({ from: params.from, to: params.to }, session);
  }
}
