import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntryEntity } from "@/features/fixed-cost/domain/entities/fixed-cost-entry";
import {
  FixedCostEntryRepository,
  ListFixedCostEntryByDateParams,
  ListFixedCostEntryByDateResult,
  ListFixedCostEntryParams,
  ListFixedCostEntryResult,
  CreateFixedCostEntryParams,
  UpdateFixedCostEntryParams,
  DeleteFixedCostEntryParams,
} from "@/features/fixed-cost/domain/repositories/fixed-cost-entry";
import { FixedCostEntryService } from "@/features/fixed-cost/domain/sources/fixed-cost-entry";

export class FixedCostEntryRepositoryImpl implements FixedCostEntryRepository {
  constructor(private readonly service: FixedCostEntryService) {}

  public async listByDate(params: ListFixedCostEntryByDateParams, session: SessionEntity): Promise<DataState<ListFixedCostEntryByDateResult>> {
    try {
      const result = await this.service.listByDate(params, session);
      return new DataSuccess({
        entries: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async list(params: ListFixedCostEntryParams, session: SessionEntity): Promise<DataState<ListFixedCostEntryResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        entries: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateFixedCostEntryParams, session: SessionEntity): Promise<DataState<FixedCostEntryEntity>> {
    try {
      const result = await this.service.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(params: UpdateFixedCostEntryParams, session: SessionEntity): Promise<DataState<FixedCostEntryEntity>> {
    try {
      const result = await this.service.update(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(params: DeleteFixedCostEntryParams, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.delete(params, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
