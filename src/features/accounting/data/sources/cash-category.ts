import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashCategoryModel } from "@/features/accounting/data/models/cash-category-model";
import {
  CashCategoryService,
  ListCashCategoriesServiceParams,
  ListCashCategoriesServiceResult,
  CreateCashCategoryServiceParams,
  UpdateCashCategoryServiceParams,
  DeleteCashCategoryServiceParams,
} from "@/features/accounting/domain/sources/cash-category";

export class CashCategoryServiceImpl implements CashCategoryService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: ListCashCategoriesServiceParams,
    session: SessionEntity,
  ): Promise<ListCashCategoriesServiceResult> {
    try {
      // The spec declares `direction` as the only filter — no `page`/`limit`/`search` param,
      // even though the response still carries a `meta` envelope.
      const searchParams: Record<string, any> = {};
      if (params.direction) searchParams["direction"] = params.direction;

      const result = await this.http.request({
        path: "/accounting/cash-categories",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(CashCategoryModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 25,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateCashCategoryServiceParams, session: SessionEntity): Promise<CashCategoryModel> {
    try {
      const result = await this.http.request({
        path: "/accounting/cash-categories",
        method: "POST",
        body: { name: params.name, account_id: params.accountId, direction: params.direction },
        session,
      });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashCategoryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateCashCategoryServiceParams, session: SessionEntity): Promise<CashCategoryModel> {
    try {
      // Partial update: an omitted key means "leave unchanged", so the body is built key by
      // key rather than passed through — `undefined` is dropped by JSON.stringify and would
      // silently read as "unchanged" even when the caller meant to send a value.
      const body: Record<string, any> = {};
      if (params.name !== undefined) body["name"] = params.name;
      if (params.accountId !== undefined) body["account_id"] = params.accountId;

      const result = await this.http.request({
        path: `/accounting/cash-categories/${params.id}`,
        method: "PATCH",
        body,
        session,
      });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashCategoryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(params: DeleteCashCategoryServiceParams, session: SessionEntity): Promise<void> {
    try {
      // 204 No Content — there is no body to parse.
      await this.http.request({
        path: `/accounting/cash-categories/${params.id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
