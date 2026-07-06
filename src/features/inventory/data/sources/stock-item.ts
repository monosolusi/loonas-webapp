import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockItemModel } from "@/features/inventory/data/models/stock-item";
import { StockItemService, ListStockItemsServiceResult } from "@/features/inventory/domain/sources/stock-item";
import { ListStockItemsParams, UpdateStockItemParams } from "@/features/inventory/domain/repositories/stock-item";

export class StockItemServiceImpl implements StockItemService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListStockItemsParams, session: SessionEntity): Promise<ListStockItemsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.type) searchParams["type"] = params.type;
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/inventory/stock-items",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(StockItemModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 100,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listLowStock(
    params: ListStockItemsParams,
    session: SessionEntity,
  ): Promise<ListStockItemsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/inventory/stock-items/low-stock",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(StockItemModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 100,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(id: string, session: SessionEntity): Promise<StockItemModel> {
    try {
      const result = await this.http.request({
        path: `/inventory/stock-items/${id}`,
        method: "GET",
        session,
      });

      return StockItemModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateStockItemParams, session: SessionEntity): Promise<StockItemModel> {
    try {
      const result = await this.http.request({
        path: `/inventory/stock-items/${params.id}`,
        method: "PUT",
        body: { min_stock: params.minStock },
        session,
      });

      return StockItemModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
