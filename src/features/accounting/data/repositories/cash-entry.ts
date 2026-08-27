import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import {
  CashEntryRepository,
  ListCashEntriesParams,
  ListCashEntriesResult,
  CreateCashEntryParams,
  GetCashEntryParams,
  CancelCashEntryParams,
} from "@/features/accounting/domain/repositories/cash-entry";
import { CashEntryService } from "@/features/accounting/domain/sources/cash-entry";

export class CashEntryRepositoryImpl implements CashEntryRepository {
  constructor(private readonly service: CashEntryService) {}

  public async list(
    params: ListCashEntriesParams,
    session: SessionEntity,
  ): Promise<DataState<ListCashEntriesResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({ entries: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateCashEntryParams, session: SessionEntity): Promise<DataState<CashEntryEntity>> {
    try {
      const model = await this.service.create(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(params: GetCashEntryParams, session: SessionEntity): Promise<DataState<CashEntryEntity>> {
    try {
      const model = await this.service.get(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async cancel(params: CancelCashEntryParams, session: SessionEntity): Promise<DataState<CashEntryEntity>> {
    try {
      const model = await this.service.cancel(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
