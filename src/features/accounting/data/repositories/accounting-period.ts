import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";
import { ClosePeriodResult } from "@/features/accounting/domain/entities/close-warning";
import { RetryFailedPostingsResult } from "@/features/accounting/domain/entities/retry-failed-postings-result";
import {
  AccountingPeriodRepository,
  ClosePeriodParams,
  CloseYearParams,
  CloseYearResult,
  GetYearSummaryParams,
  ListPeriodsParams,
  ListPeriodsResult,
  ReopenPeriodParams,
  ReopenYearParams,
  ReopenYearResult,
  RetryFailedPostingsParams,
} from "@/features/accounting/domain/repositories/accounting-period";
import { AccountingPeriodService } from "@/features/accounting/domain/sources/accounting-period";

export class AccountingPeriodRepositoryImpl implements AccountingPeriodRepository {
  constructor(private readonly service: AccountingPeriodService) {}

  public async list(params: ListPeriodsParams, session: SessionEntity): Promise<DataState<ListPeriodsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({ data: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async close(params: ClosePeriodParams, session: SessionEntity): Promise<DataState<ClosePeriodResult>> {
    try {
      const r = await this.service.close(params, session);
      return new DataSuccess({ period: r.period.toEntity(), warnings: r.warnings });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<DataState<AccountingPeriodEntity>> {
    try {
      const model = await this.service.reopen(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getYearSummary(params: GetYearSummaryParams, session: SessionEntity): Promise<DataState<YearEndSummaryEntity>> {
    try {
      const model = await this.service.getYearSummary(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async closeYear(params: CloseYearParams, session: SessionEntity): Promise<DataState<CloseYearResult>> {
    try {
      const r = await this.service.closeYear(params, session);
      return new DataSuccess({ closingJournalId: r.closingJournalId, periods: r.periods.map((p) => p.toEntity()) });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async reopenYear(params: ReopenYearParams, session: SessionEntity): Promise<DataState<ReopenYearResult>> {
    try {
      const r = await this.service.reopenYear(params, session);
      return new DataSuccess({ reversalJournalId: r.reversalJournalId, periods: r.periods.map((p) => p.toEntity()) });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async retryFailedPostings(
    params: RetryFailedPostingsParams,
    session: SessionEntity,
  ): Promise<DataState<RetryFailedPostingsResult>> {
    try {
      const model = await this.service.retryFailedPostings(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
