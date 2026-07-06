import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  ReportService,
  GetNeracaParams,
  GetLabaRugiParams,
  GetArusKasParams,
  GetTrialBalanceParams,
  GetGeneralLedgerParams,
  GetCalkParams,
  GetNeracaServiceResult,
  GetLabaRugiServiceResult,
  GetArusKasServiceResult,
  GetTrialBalanceServiceResult,
  GetGeneralLedgerServiceResult,
  GetCalkServiceResult,
  ListTrialBalanceLinesParams,
  ListTrialBalanceLinesServiceResult,
} from "@/features/accounting/domain/sources/report";

export class ReportServiceImpl implements ReportService {
  constructor(private readonly http: HttpRequest) {}

  public async getNeraca(params: GetNeracaParams, session: SessionEntity): Promise<GetNeracaServiceResult> {
    try {
      const searchParams: Record<string, any> = { as_of: params.asOf };
      if (params.compareTo !== undefined) searchParams["compare_to"] = params.compareTo;

      const result = await this.http.request({
        path: "/accounting/reports/neraca",
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

  public async getLabaRugi(params: GetLabaRugiParams, session: SessionEntity): Promise<GetLabaRugiServiceResult> {
    try {
      const body: Record<string, any> = { start_date: params.from, end_date: params.to };
      if (params.compareFrom && params.compareTo) {
        body["compare_start_date"] = params.compareFrom;
        body["compare_end_date"] = params.compareTo;
      }

      const result = await this.http.request({
        path: "/accounting/reports/laba-rugi",
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

  public async getArusKas(params: GetArusKasParams, session: SessionEntity): Promise<GetArusKasServiceResult> {
    try {
      const searchParams: Record<string, any> = { start_date: params.from, end_date: params.to };

      const result = await this.http.request({
        path: "/accounting/reports/arus-kas",
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

  public async getCalk(params: GetCalkParams, session: SessionEntity): Promise<GetCalkServiceResult> {
    try {
      const searchParams: Record<string, any> = { as_of: params.asOf };

      const result = await this.http.request({
        path: "/accounting/reports/calk",
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
}
