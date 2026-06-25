import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { AccountingPeriodService, ListPeriodsServiceResult } from "@/features/accounting/domain/sources/accounting-period";
import { ClosePeriodParams, ListPeriodsParams, ReopenPeriodParams } from "@/features/accounting/domain/repositories/accounting-period";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AccountingPeriodServiceImpl implements AccountingPeriodService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListPeriodsParams, session: SessionEntity): Promise<ListPeriodsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.status) searchParams["status"] = params.status;

      const result = await this.http.request({ path: "/accounting/periods", method: "GET", searchParams, session });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(AccountingPeriodModel.fromJson),
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

  public async close(params: ClosePeriodParams, session: SessionEntity): Promise<AccountingPeriodModel> {
    try {
      const body: Record<string, any> = params.reason ? { reason: params.reason } : {};

      const result = await this.http.request(
        { path: `/accounting/periods/${params.id}/close`, method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return AccountingPeriodModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<AccountingPeriodModel> {
    try {
      const body: Record<string, any> = { reason: params.reason };

      const result = await this.http.request(
        { path: `/accounting/periods/${params.id}/reopen`, method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return AccountingPeriodModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
