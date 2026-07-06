import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PurchaseModel } from "@/features/purchasing/data/models/purchase";
import { PurchaseService, ListPurchasesServiceResult } from "@/features/purchasing/domain/sources/purchase";
import { CreatePurchaseParams, ListPurchasesParams } from "@/features/purchasing/domain/repositories/purchase";

export class PurchaseServiceImpl implements PurchaseService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListPurchasesParams, session: SessionEntity): Promise<ListPurchasesServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.search) searchParams["search"] = params.search;
      if (params.dateFrom && params.dateTo) {
        searchParams["start_date"] = params.dateFrom;
        searchParams["end_date"] = params.dateTo;
      }
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/purchasing/purchases",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(PurchaseModel.fromJson),
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

  public async get(id: string, session: SessionEntity): Promise<PurchaseModel> {
    try {
      const result = await this.http.request({
        path: `/purchasing/purchases/${id}`,
        method: "GET",
        session,
      });

      return PurchaseModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreatePurchaseParams, session: SessionEntity): Promise<PurchaseModel> {
    try {
      const body: Record<string, any> = {
        date: params.date,
        items: params.items.map((item) => {
          const entry: Record<string, any> = {
            quantity: item.quantity,
            unit_price: item.unitPrice,
          };
          if (item.rawMaterialId) entry["raw_material"] = { id: item.rawMaterialId };
          if (item.variantId) entry["variant"] = { id: item.variantId };
          return entry;
        }),
      };
      if (params.note) body["note"] = params.note;

      const result = await this.http.request({
        path: "/purchasing/purchases",
        method: "POST",
        body,
        session,
      });

      return PurchaseModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/purchasing/purchases/${id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
