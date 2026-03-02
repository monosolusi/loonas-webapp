import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DashboardRepository } from "@/features/dashboard/domain/repositories/dashboard";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";

export class GetDashboardStatisticsUseCase implements UseCase<DataState<DashboardStatisticsEntity>, void> {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<DashboardStatisticsEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.dashboardRepository.getStatistics(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
