import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import {
  AccountingPeriodRepository,
  ClosePeriodParams,
  ListPeriodsParams,
  ListPeriodsResult,
  ReopenPeriodParams,
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

  public async close(params: ClosePeriodParams, session: SessionEntity): Promise<DataState<AccountingPeriodEntity>> {
    try {
      const model = await this.service.close(params, session);
      return new DataSuccess(model.toEntity());
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
}
