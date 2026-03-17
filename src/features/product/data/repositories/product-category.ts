import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { ProductCategoryRepository, ListCategoriesResult } from "@/features/product/domain/repositories/product-category";
import { ProductCategoryService, ListCategoriesParams } from "@/features/product/domain/sources/product-category";

export class ProductCategoryRepositoryImpl implements ProductCategoryRepository {
  constructor(private readonly service: ProductCategoryService) {}

  public async list(search: string | undefined, session: SessionEntity): Promise<DataState<ProductCategoryEntity[]>> {
    try {
      const categories = await this.service.list(search, session);
      return new DataSuccess(categories.map((c) => c.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listPaginated(params: ListCategoriesParams, session: SessionEntity): Promise<DataState<ListCategoriesResult>> {
    try {
      const result = await this.service.listPaginated(params, session);
      return new DataSuccess({
        categories: result.data.map((c) => c.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(name: string, session: SessionEntity): Promise<DataState<ProductCategoryEntity>> {
    try {
      const category = await this.service.create(name, session);
      return new DataSuccess(category.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(id: string, name: string, session: SessionEntity): Promise<DataState<ProductCategoryEntity>> {
    try {
      const category = await this.service.update(id, name, session);
      return new DataSuccess(category.toEntity());
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
