import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import {
  RawMaterialService,
  ListRawMaterialsServiceResult,
} from "@/features/raw-material/domain/sources/raw-material";
import {
  CreateRawMaterialParams,
  UpdateRawMaterialParams,
  ListRawMaterialsParams,
} from "@/features/raw-material/domain/repositories/raw-material";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class RawMaterialServiceImpl implements RawMaterialService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListRawMaterialsParams, session: SessionEntity): Promise<ListRawMaterialsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.search) searchParams["search"] = params.search;

      const result = await this.http.request({
        path: "/raw-materials",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(RawMaterialModel.fromJson),
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

  public async get(id: string, session: SessionEntity): Promise<RawMaterialModel> {
    try {
      const result = await this.http.request({
        path: `/raw-materials/${id}`,
        method: "GET",
        session,
      });

      return RawMaterialModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateRawMaterialParams, session: SessionEntity): Promise<RawMaterialModel> {
    try {
      const result = await this.http.request({
        path: "/raw-materials",
        method: "POST",
        body: { name: params.name, unit: params.unit },
        session,
      });

      return RawMaterialModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(id: string, params: UpdateRawMaterialParams, session: SessionEntity): Promise<RawMaterialModel> {
    try {
      const body: Record<string, any> = {};
      if (params.name !== undefined) body["name"] = params.name;
      if (params.unit !== undefined) body["unit"] = params.unit;

      const result = await this.http.request({
        path: `/raw-materials/${id}`,
        method: "PUT",
        body,
        session,
      });

      return RawMaterialModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/raw-materials/${id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
