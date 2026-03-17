import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductCategoryModel } from "@/features/product/data/models/product-category";
import { ProductCategoryService, ListCategoriesParams, ListCategoriesServiceResult } from "@/features/product/domain/sources/product-category";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ProductCategoryServiceImpl implements ProductCategoryService {
  constructor(private readonly http: HttpRequest) {}

  public async list(search: string | undefined, session: SessionEntity): Promise<ProductCategoryModel[]> {
    try {
      const searchParams: Record<string, any> = { limit: "100" };
      if (search) searchParams["search"] = search;

      const result = await this.http.request({
        path: "/product-categories",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return items.map(ProductCategoryModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listPaginated(params: ListCategoriesParams, session: SessionEntity): Promise<ListCategoriesServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.search) searchParams["search"] = params.search;

      const result = await this.http.request({
        path: "/product-categories",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(ProductCategoryModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 10,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(name: string, session: SessionEntity): Promise<ProductCategoryModel> {
    try {
      const result = await this.http.request({
        path: "/product-categories",
        method: "POST",
        body: { name },
        session,
      });

      return ProductCategoryModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(id: string, name: string, session: SessionEntity): Promise<ProductCategoryModel> {
    try {
      const result = await this.http.request({
        path: `/product-categories/${id}`,
        method: "PUT",
        body: { name },
        session,
      });

      return ProductCategoryModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/product-categories/${id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
