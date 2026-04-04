import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementModel } from "@/features/inventory/data/models/stock-movement";
import {
  StockMovementService,
  ListStockMovementsServiceResult,
} from "@/features/inventory/domain/sources/stock-movement";
import { ListStockMovementsParams } from "@/features/inventory/domain/repositories/stock-movement";

export class StockMovementServiceImpl implements StockMovementService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: ListStockMovementsParams,
    session: SessionEntity,
  ): Promise<ListStockMovementsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.stockItemId) searchParams["stock_item_id"] = params.stockItemId;
      if (params.type) searchParams["type"] = params.type;
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/inventory/movements",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(StockMovementModel.fromJson),
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
}
