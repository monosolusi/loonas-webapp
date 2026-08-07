import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ReportService,
  GetBalanceSheetParams,
  GetIncomeStatementParams,
  GetCashFlowParams,
  GetTrialBalanceParams,
  GetGeneralLedgerParams,
  GetNotesParams,
  GetBalanceSheetServiceResult,
  GetIncomeStatementServiceResult,
  GetCashFlowServiceResult,
  GetTrialBalanceServiceResult,
  GetGeneralLedgerServiceResult,
  GetNotesServiceResult,
  ListTrialBalanceLinesParams,
  ListTrialBalanceLinesServiceResult,
  ListCostValuationGapsParams,
  ListCostValuationGapsServiceResult,
} from "@/features/accounting/domain/sources/report";
import { CostValuationGapRowModel } from "@/features/accounting/data/models/cost-valuation-gap";

export class ReportServiceImpl implements ReportService {
  constructor(private readonly http: HttpRequest) {}

  public async getBalanceSheet(
    params: GetBalanceSheetParams,
    session: SessionEntity,
  ): Promise<GetBalanceSheetServiceResult> {
    try {
      const searchParams: Record<string, any> = { as_of: params.asOf };
      if (params.compareTo !== undefined) searchParams["compare_to"] = params.compareTo;

      const result = await this.http.request({
        path: "/accounting/reports/balance-sheet",
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return { data: result.data };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getIncomeStatement(
    params: GetIncomeStatementParams,
    session: SessionEntity,
  ): Promise<GetIncomeStatementServiceResult> {
    try {
      const body: Record<string, any> = { start_date: params.from, end_date: params.to };
      if (params.compareFrom && params.compareTo) {
        body["compare_start_date"] = params.compareFrom;
        body["compare_end_date"] = params.compareTo;
      }

      const result = await this.http.request({
        path: "/accounting/reports/income-statement",
        method: "POST",
        body,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return { data: result.data };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getCashFlow(params: GetCashFlowParams, session: SessionEntity): Promise<GetCashFlowServiceResult> {
    try {
      const searchParams: Record<string, any> = { start_date: params.from, end_date: params.to };

      const result = await this.http.request({
        path: "/accounting/reports/cash-flow",
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return { data: result.data };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getTrialBalance(
    params: GetTrialBalanceParams,
    session: SessionEntity,
  ): Promise<GetTrialBalanceServiceResult> {
    try {
      const searchParams: Record<string, any> = { as_of: params.asOf };
      if (params.includeZero !== undefined) searchParams["include_zero"] = String(params.includeZero);

      const result = await this.http.request({
        path: "/accounting/reports/trial-balance",
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return { data: result.data };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getGeneralLedger(
    params: GetGeneralLedgerParams,
    session: SessionEntity,
  ): Promise<GetGeneralLedgerServiceResult> {
    try {
      const searchParams: Record<string, any> = { start_date: params.from, end_date: params.to };
      if (params.page !== undefined) searchParams["page"] = String(params.page);
      if (params.limit !== undefined) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: `/accounting/reports/general-ledger/${params.accountId}`,
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return {
        data: result.data,
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

  public async getNotes(params: GetNotesParams, session: SessionEntity): Promise<GetNotesServiceResult> {
    try {
      const searchParams: Record<string, any> = { as_of: params.asOf };

      const result = await this.http.request({
        path: "/accounting/reports/notes",
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return { data: result.data };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listTrialBalanceLines(
    params: ListTrialBalanceLinesParams,
    session: SessionEntity,
  ): Promise<ListTrialBalanceLinesServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.from !== undefined && params.to !== undefined) {
        searchParams["start_date"] = params.from;
        searchParams["end_date"] = params.to;
      }
      if (params.page !== undefined) searchParams["page"] = String(params.page);
      if (params.limit !== undefined) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: `/accounting/reports/trial-balance/${params.accountId}/lines`,
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const meta: ListTrialBalanceLinesServiceResult["meta"] = {
        page: result.meta?.page ?? 1,
        limit: result.meta?.limit ?? 50,
        total: result.meta?.total ?? 0,
        totalPages: result.meta?.total_pages ?? 1,
      };

      return {
        data: result.data,
        counterparts: result.counterparts ?? [],
        meta,
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listCostValuationGaps(
    params: ListCostValuationGapsParams,
    session: SessionEntity,
  ): Promise<ListCostValuationGapsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      // Both-or-neither: only send the date pair when both are present.
      if (params.from !== undefined && params.to !== undefined) {
        searchParams["start_date"] = params.from;
        searchParams["end_date"] = params.to;
      }
      if (params.page !== undefined) searchParams["page"] = String(params.page);
      if (params.limit !== undefined) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/accounting/reports/cost-valuation-gaps",
        method: "GET",
        searchParams,
        session,
      });

      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const meta: ListCostValuationGapsServiceResult["meta"] = {
        page: result.meta?.page ?? 1,
        limit: result.meta?.limit ?? 25,
        total: result.meta?.total ?? 0,
        totalPages: result.meta?.total_pages ?? 1,
      };

      const rows = (result.data as Record<string, any>[]).map(CostValuationGapRowModel.fromJson);

      return { data: rows, meta };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
