import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntryModel } from "@/features/accounting/data/models/cash-entry-model";
import {
  CashEntryService,
  ListCashEntriesServiceParams,
  ListCashEntriesServiceResult,
  CreateCashEntryServiceParams,
  GetCashEntryServiceParams,
  CancelCashEntryServiceParams,
} from "@/features/accounting/domain/sources/cash-entry";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class CashEntryServiceImpl implements CashEntryService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: ListCashEntriesServiceParams,
    session: SessionEntity,
  ): Promise<ListCashEntriesServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.direction) searchParams["direction"] = params.direction;
      // Both-or-neither: `date_from`/`date_to` are only sent together — the API rejects one
      // alone with a 400. There is no `search` param on this endpoint.
      if (params.dateFrom && params.dateTo) {
        searchParams["date_from"] = params.dateFrom;
        searchParams["date_to"] = params.dateTo;
      }

      const result = await this.http.request({
        path: "/accounting/cash-entries",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(CashEntryModel.fromJson),
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

  public async create(params: CreateCashEntryServiceParams, session: SessionEntity): Promise<CashEntryModel> {
    try {
      // Create body key is `date`; the response returns it back as `entry_date` — a
      // deliberate Joi-field-vs-column-name asymmetry.
      const body: Record<string, any> = {
        direction: params.direction,
        amount: params.amount,
        category_id: params.categoryId,
        date: params.date,
      };
      if (params.note !== undefined) body["note"] = params.note;

      const result = await this.http.request(
        { path: "/accounting/cash-entries", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashEntryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(params: GetCashEntryServiceParams, session: SessionEntity): Promise<CashEntryModel> {
    try {
      const result = await this.http.request({
        path: `/accounting/cash-entries/${params.id}`,
        method: "GET",
        session,
      });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashEntryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async cancel(params: CancelCashEntryServiceParams, session: SessionEntity): Promise<CashEntryModel> {
    try {
      const body: Record<string, any> = {};
      if (params.note !== undefined) body["note"] = params.note;

      // The response is the CANCELLATION entry, not the original — `status: "cancellation"`,
      // `cancelsId` set to the original entry's id.
      const result = await this.http.request(
        { path: `/accounting/cash-entries/${params.id}/cancel`, method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashEntryModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
