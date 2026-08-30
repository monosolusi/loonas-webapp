import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import {
  CashCategoryRepository,
  ListCashCategoriesParams,
  CreateCashCategoryParams,
  UpdateCashCategoryParams,
  DeleteCashCategoryParams,
} from "@/features/accounting/domain/repositories/cash-category";
import { CashCategoryService } from "@/features/accounting/domain/sources/cash-category";

export class CashCategoryRepositoryImpl implements CashCategoryRepository {
  constructor(private readonly service: CashCategoryService) {}

  public async list(
    params: ListCashCategoriesParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<CashCategoryEntity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({ data: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(
    params: CreateCashCategoryParams,
    session: SessionEntity,
  ): Promise<DataState<CashCategoryEntity>> {
    try {
      const model = await this.service.create(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(
    params: UpdateCashCategoryParams,
    session: SessionEntity,
  ): Promise<DataState<CashCategoryEntity>> {
    try {
      const model = await this.service.update(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(params: DeleteCashCategoryParams, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.delete(params, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
