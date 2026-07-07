import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { YearEndSummaryModel } from "@/features/accounting/data/models/year-end-summary";
import { CloseWarningModel } from "@/features/accounting/data/models/close-warning";
import {
  AccountingPeriodService,
  ClosePeriodServiceParams,
  ClosePeriodServiceResult,
  CloseYearServiceParams,
  CloseYearServiceResult,
  GetYearSummaryServiceParams,
  GetYearSummaryServiceResult,
  ListPeriodsServiceParams,
  ListPeriodsServiceResult,
  ReopenPeriodServiceParams,
  ReopenYearServiceParams,
  ReopenYearServiceResult,
} from "@/features/accounting/domain/sources/accounting-period";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AccountingPeriodServiceImpl implements AccountingPeriodService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListPeriodsServiceParams, session: SessionEntity): Promise<ListPeriodsServiceResult> {
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

  public async close(params: ClosePeriodServiceParams, session: SessionEntity): Promise<ClosePeriodServiceResult> {
    try {
      const body: Record<string, any> = params.reason ? { reason: params.reason } : {};

      const result = await this.http.request(
        { path: `/accounting/periods/${params.id}/close`, method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      const data = result;
      return {
        period: AccountingPeriodModel.fromJson(data),
        warnings: Array.isArray(data?.warnings) ? data.warnings.map(CloseWarningModel.fromJson) : [],
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async reopen(params: ReopenPeriodServiceParams, session: SessionEntity): Promise<AccountingPeriodModel> {
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

  public async getYearSummary(params: GetYearSummaryServiceParams, session: SessionEntity): Promise<GetYearSummaryServiceResult> {
    try {
      const result = await this.http.request({ path: `/accounting/periods/year/${params.year}`, method: "GET", session });
      return YearEndSummaryModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async closeYear(params: CloseYearServiceParams, session: SessionEntity): Promise<CloseYearServiceResult> {
    try {
      const body: Record<string, any> = {
        year: params.year,
        ...(params.retainedEarningsAccountId ? { retained_earnings_account_id: params.retainedEarningsAccountId } : {}),
      };

      const result = await this.http.request(
        { path: "/accounting/periods/close-year", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      const data = result;
      return {
        closingJournalId: data.closing_journal_id,
        periods: (data.periods ?? []).map(AccountingPeriodModel.fromJson),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async reopenYear(params: ReopenYearServiceParams, session: SessionEntity): Promise<ReopenYearServiceResult> {
    try {
      const body: Record<string, any> = {
        year: params.year,
        confirmation_token: params.confirmationToken,
        reason: params.reason,
      };

      const result = await this.http.request(
        { path: "/accounting/periods/reopen-year", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      const data = result;
      return {
        reversalJournalId: data.reversal_journal_id,
        periods: (data.periods ?? []).map(AccountingPeriodModel.fromJson),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
