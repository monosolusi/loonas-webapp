import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingModel } from "@/features/accounting/data/models/coa-mapping";
import {
  CoaMappingService,
  ListCoaMappingsServiceResult,
  ListCoaMappingsServiceParams,
  CreateCoaMappingServiceParams,
  UpdateCoaMappingServiceParams,
  DeleteCoaMappingServiceParams,
  CoaMappingLineServiceInput,
} from "@/features/accounting/domain/sources/coa-mapping";

function serializeLine(line: CoaMappingLineServiceInput, index: number): Record<string, any> {
  const body: Record<string, any> = {
    account_id: line.accountId,
    position: line.position,
    sort_order: line.sortOrder ?? index,
  };
  if (line.label !== undefined && line.label !== null && line.label.trim().length > 0) {
    body["label"] = line.label.trim();
  }
  return body;
}

export class CoaMappingServiceImpl implements CoaMappingService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListCoaMappingsServiceParams, session: SessionEntity): Promise<ListCoaMappingsServiceResult> {
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

  public async create(params: CreateCoaMappingServiceParams, session: SessionEntity): Promise<CoaMappingModel> {
    try {
      const body: Record<string, any> = {
        entity_type: params.entityType,
        lines: params.lines.map(serializeLine),
      };
      if (params.entityId !== undefined && params.entityId !== null && params.entityId.trim().length > 0) {
        body["entity_id"] = params.entityId.trim();
      }

      const result = await this.http.request({
        path: "/accounting/coa-mappings",
        method: "POST",
        body,
        session,
      });

      return CoaMappingModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateCoaMappingServiceParams, session: SessionEntity): Promise<CoaMappingModel> {
    try {
      const body: Record<string, any> = {
        lines: params.lines.map(serializeLine),
      };

      const result = await this.http.request({
        path: `/accounting/coa-mappings/${params.id}`,
        method: "PUT",
        body,
        session,
      });

      return CoaMappingModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(params: DeleteCoaMappingServiceParams, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/accounting/coa-mappings/${params.id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
