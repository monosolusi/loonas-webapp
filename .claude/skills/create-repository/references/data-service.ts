// Canonical example: service implementation. Uses HttpRequest; throws on failure.
// Source: src/features/production/data/sources/production-record.ts

import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionRecordModel } from "@/features/production/data/models/production-record";
import {
  ProductionRecordService,
  ListProductionRecordsServiceResult,
} from "@/features/production/domain/sources/production-record";
import {
  ListProductionRecordsParams,
  CreateProductionRecordParams,
  DeleteProductionRecordParams,
} from "@/features/production/domain/repositories/production-record";

export class ProductionRecordServiceImpl implements ProductionRecordService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: ListProductionRecordsParams,
    session: SessionEntity,
  ): Promise<ListProductionRecordsServiceResult> {
    try {
      // Build searchParams only when a value is present — keeps the URL clean.
      const searchParams: Record<string, any> = {};
      if (params.search) searchParams["search"] = params.search;
      if (params.dateFrom) searchParams["date_from"] = params.dateFrom;
      if (params.dateTo) searchParams["date_to"] = params.dateTo;
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const path = params.productId ? `/products/${params.productId}/productions` : "/productions";

      const result = await this.http.request({
        path,
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(ProductionRecordModel.fromJson),
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

  public async get(id: string, session: SessionEntity): Promise<ProductionRecordModel> {
    try {
      const result = await this.http.request({
        path: `/productions/${id}`,
        method: "GET",
        session,
      });

      return ProductionRecordModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateProductionRecordParams, session: SessionEntity): Promise<ProductionRecordModel> {
    try {
      const body: Record<string, any> = {
        quantity: params.quantity,
      };
      if (params.producedAt) body["produced_at"] = params.producedAt;
      if (params.note) body["note"] = params.note;

      const result = await this.http.request({
        path: `/products/${params.productId}/variants/${params.variantId}/productions`,
        method: "POST",
        body,
        session,
      });

      return ProductionRecordModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(params: DeleteProductionRecordParams, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${params.productId}/variants/${params.variantId}/productions/${params.id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
