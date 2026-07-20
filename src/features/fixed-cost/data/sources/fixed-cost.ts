import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostModel } from "@/features/fixed-cost/data/models/fixed-cost";
import { FixedCostService, ListFixedCostsServiceResult, CreateFixedCostServiceParams, UpdateFixedCostServiceParams } from "@/features/fixed-cost/domain/sources/fixed-cost";
import { ListFixedCostsParams } from "@/features/fixed-cost/domain/repositories/fixed-cost";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class FixedCostServiceImpl implements FixedCostService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListFixedCostsParams, session: SessionEntity): Promise<ListFixedCostsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.search) searchParams["search"] = params.search;

      const result = await this.http.request({
        path: "/accounting/fixed-costs",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(FixedCostModel.fromJson),
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

  public async create(params: CreateFixedCostServiceParams, session: SessionEntity): Promise<FixedCostModel> {
    try {
      const result = await this.http.request({
        path: "/accounting/fixed-costs",
        method: "POST",
        body: { name: params.name, category: params.category },
        session,
      });
      return FixedCostModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateFixedCostServiceParams, session: SessionEntity): Promise<FixedCostModel> {
    try {
      const result = await this.http.request({
        path: `/accounting/fixed-costs/${params.id}`,
        method: "PUT",
        body: { name: params.name, category: params.category },
        session,
      });
      return FixedCostModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/accounting/fixed-costs/${id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
