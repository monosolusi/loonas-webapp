import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import {
  ProductionRecordRepository,
  ListProductionRecordsParams,
  CreateProductionRecordParams,
  DeleteProductionRecordParams,
} from "@/features/production/domain/repositories/production-record";
import { ProductionRecordService } from "@/features/production/domain/sources/production-record";

export class ProductionRecordRepositoryImpl implements ProductionRecordRepository {
  constructor(private readonly service: ProductionRecordService) {}

  public async list(
    params: ListProductionRecordsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<ProductionRecordEntity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        data: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(id: string, session: SessionEntity): Promise<DataState<ProductionRecordEntity>> {
    try {
      const result = await this.service.get(id, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(
    params: CreateProductionRecordParams,
    session: SessionEntity,
  ): Promise<DataState<ProductionRecordEntity>> {
    try {
      const result = await this.service.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(params: DeleteProductionRecordParams, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.delete(params, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
