import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { YearEndSummaryModel } from "@/features/accounting/data/models/year-end-summary";
import { CloseWarningModel } from "@/features/accounting/data/models/close-warning";
import {
  AccountingPeriodService,
  ClosePeriodServiceResult,
  ListPeriodsServiceResult,
  GetYearSummaryServiceResult,
  CloseYearServiceResult,
  ReopenYearServiceResult,
} from "@/features/accounting/domain/sources/accounting-period";
import {
  ClosePeriodParams,
  CloseYearParams,
  GetYearSummaryParams,
  ListPeriodsParams,
  ReopenPeriodParams,
  ReopenYearParams,
} from "@/features/accounting/domain/repositories/accounting-period";
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

  public async close(params: ClosePeriodParams, session: SessionEntity): Promise<ClosePeriodServiceResult> {
    try {
      const body: Record<string, any> = params.reason ? { reason: params.reason } : {};

      const result = await this.http.request(
        { path: `/accounting/periods/${params.id}/close`, method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return {
        period: AccountingPeriodModel.fromJson(result),
        warnings: Array.isArray(result?.warnings) ? result.warnings.map(CloseWarningModel.fromJson) : [],
      };
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

  public async getYearSummary(params: GetYearSummaryParams, session: SessionEntity): Promise<GetYearSummaryServiceResult> {
    try {
      const result = await this.http.request({ path: `/accounting/periods/year/${params.year}`, method: "GET", session });
      return YearEndSummaryModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async closeYear(params: CloseYearParams, session: SessionEntity): Promise<CloseYearServiceResult> {
    try {
      const body: Record<string, any> = {
        year: params.year,
        ...(params.retainedEarningsAccountId ? { retained_earnings_account_id: params.retainedEarningsAccountId } : {}),
      };

      const result = await this.http.request(
        { path: "/accounting/periods/close-year", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return {
        closingJournalId: result.closing_journal_id,
        periods: (result.periods ?? []).map(AccountingPeriodModel.fromJson),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async reopenYear(params: ReopenYearParams, session: SessionEntity): Promise<ReopenYearServiceResult> {
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

      return {
        reversalJournalId: result.reversal_journal_id,
        periods: (result.periods ?? []).map(AccountingPeriodModel.fromJson),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
