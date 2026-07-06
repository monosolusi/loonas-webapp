import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { FixedCostEntryModel } from "@/features/fixed-cost/data/models/fixed-cost-entry";
import { FixedCostEntryService, ListFixedCostEntryServiceResult } from "@/features/fixed-cost/domain/sources/fixed-cost-entry";
import {
  ListFixedCostEntryByDateParams,
  ListFixedCostEntryParams,
  CreateFixedCostEntryParams,
  UpdateFixedCostEntryParams,
  DeleteFixedCostEntryParams,
} from "@/features/fixed-cost/domain/repositories/fixed-cost-entry";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class FixedCostEntryServiceImpl implements FixedCostEntryService {
  constructor(private readonly http: HttpRequest) {}

  public async listByDate(params: ListFixedCostEntryByDateParams, session: SessionEntity): Promise<ListFixedCostEntryServiceResult> {
    try {
      const searchParams: Record<string, any> = {
        start_date: params.startDate,
        end_date: params.endDate,
      };
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/accounting/fixed-cost-entries",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(FixedCostEntryModel.fromJson),
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

  public async list(params: ListFixedCostEntryParams, session: SessionEntity): Promise<ListFixedCostEntryServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: `/accounting/fixed-costs/${params.fixedCostId}/entries`,
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(FixedCostEntryModel.fromJson),
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

  public async create(params: CreateFixedCostEntryParams, session: SessionEntity): Promise<FixedCostEntryModel> {
    try {
      const result = await this.http.request({
        path: `/accounting/fixed-costs/${params.fixedCostId}/entries`,
        method: "POST",
        body: {
          amount: params.amount,
          start_date: params.startDate,
          end_date: params.endDate,
        },
        session,
      });
      return FixedCostEntryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateFixedCostEntryParams, session: SessionEntity): Promise<FixedCostEntryModel> {
    try {
      const body: Record<string, any> = {};
      if (params.amount !== undefined) body["amount"] = params.amount;
      if (params.startDate !== undefined) body["start_date"] = params.startDate;
      if (params.endDate !== undefined) body["end_date"] = params.endDate;

      const result = await this.http.request({
        path: `/accounting/fixed-costs/${params.fixedCostId}/entries/${params.entryId}`,
        method: "PUT",
        body,
        session,
      });
      return FixedCostEntryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(params: DeleteFixedCostEntryParams, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/accounting/fixed-costs/${params.fixedCostId}/entries/${params.entryId}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
