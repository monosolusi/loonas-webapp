import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";
import { AccountingPeriodRepository } from "@/features/accounting/domain/repositories/accounting-period";

export type GetYearSummaryUseCaseParams = {
  readonly year: number;
};

export class GetYearSummaryUseCase implements UseCase<DataState<YearEndSummaryEntity>, GetYearSummaryUseCaseParams> {
  constructor(
    private readonly repo: AccountingPeriodRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetYearSummaryUseCaseParams): Promise<DataState<YearEndSummaryEntity>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.fetchSummary(params, session));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async fetchSummary(params: GetYearSummaryUseCaseParams, session: SessionEntity): Promise<YearEndSummaryEntity> {
    const result = await this.repo.getYearSummary({ year: params.year }, session);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
