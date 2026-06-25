import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { AccountingPeriodRepository } from "@/features/accounting/domain/repositories/accounting-period";

export class ReopenYearUseCaseParams {
  constructor(
    public readonly year: number,
    public readonly confirmationToken: string,
    public readonly reason: string,
    public readonly idempotencyKey: string,
  ) {}
}

export type ReopenYearUseCaseResult = {
  reversalJournalId: string;
  periods: AccountingPeriodEntity[];
};

export class ReopenYearUseCase implements UseCase<DataState<ReopenYearUseCaseResult>, ReopenYearUseCaseParams> {
  constructor(
    private readonly repo: AccountingPeriodRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ReopenYearUseCaseParams): Promise<DataState<ReopenYearUseCaseResult>> {
    try {
      const session = await this.sessionRepo.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      const res = await this.repo.reopenYear(
        { year: params.year, confirmationToken: params.confirmationToken, reason: params.reason, idempotencyKey: params.idempotencyKey },
        session.data,
      );
      if (res instanceof DataFailed) return res;
      if (!res.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return new DataSuccess({ reversalJournalId: res.data.reversalJournalId, periods: res.data.periods });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
