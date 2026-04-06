import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { PurchaseRepository, CreatePurchaseParams, ListPurchasesParams } from "@/features/purchasing/domain/repositories/purchase";
import { PurchaseService } from "@/features/purchasing/domain/sources/purchase";

export class PurchaseRepositoryImpl implements PurchaseRepository {
  constructor(private readonly service: PurchaseService) {}

  public async list(
    params: ListPurchasesParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<PurchaseEntity>>> {
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

  public async get(id: string, session: SessionEntity): Promise<DataState<PurchaseEntity>> {
    try {
      const result = await this.service.get(id, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreatePurchaseParams, session: SessionEntity): Promise<DataState<PurchaseEntity>> {
    try {
      const result = await this.service.create(params, session);
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
