import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";
import { AccountingPeriodRepository } from "@/features/accounting/domain/repositories/accounting-period";

export class GetYearSummaryUseCaseParams {
  constructor(public readonly year: number) {}
}

export class GetYearSummaryUseCase implements UseCase<DataState<YearEndSummaryEntity>, GetYearSummaryUseCaseParams> {
  constructor(
    private readonly repo: AccountingPeriodRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: GetYearSummaryUseCaseParams): Promise<DataState<YearEndSummaryEntity>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return this.repo.getYearSummary({ year: params.year }, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
