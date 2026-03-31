import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingModel } from "@/features/accounting/data/models/coa-mapping";
import { CoaMappingService, ListCoaMappingsServiceResult } from "@/features/accounting/domain/sources/coa-mapping";
import { ListCoaMappingsParams } from "@/features/accounting/domain/repositories/coa-mapping";

export class CoaMappingServiceImpl implements CoaMappingService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListCoaMappingsParams, session: SessionEntity): Promise<ListCoaMappingsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.entityType) searchParams["entity_type"] = params.entityType;

      const result = await this.http.request({
        path: "/accounting/coa-mappings",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(CoaMappingModel.fromJson),
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
