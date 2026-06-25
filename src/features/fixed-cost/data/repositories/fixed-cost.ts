import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { FixedCostRepository, ListFixedCostsParams, ListFixedCostsResult, CreateFixedCostParams, UpdateFixedCostParams } from "@/features/fixed-cost/domain/repositories/fixed-cost";
import { FixedCostService } from "@/features/fixed-cost/domain/sources/fixed-cost";

export class FixedCostRepositoryImpl implements FixedCostRepository {
  constructor(private readonly service: FixedCostService) {}

  public async list(params: ListFixedCostsParams, session: SessionEntity): Promise<DataState<ListFixedCostsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        fixedCosts: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateFixedCostParams, session: SessionEntity): Promise<DataState<FixedCostEntity>> {
    try {
      const result = await this.service.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(params: UpdateFixedCostParams, session: SessionEntity): Promise<DataState<FixedCostEntity>> {
    try {
      const result = await this.service.update(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.delete(id, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
