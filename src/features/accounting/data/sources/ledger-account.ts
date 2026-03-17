import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import { AccountBalanceModel } from "@/features/accounting/data/models/account-balance";
import { LedgerEntryModel } from "@/features/accounting/data/models/ledger-entry";
import {
  LedgerAccountService,
  ListLedgerAccountsServiceResult,
  ListLedgerEntriesServiceResult,
} from "@/features/accounting/domain/sources/ledger-account";
import {
  ListLedgerAccountsParams,
  GetAccountBalanceParams,
  ListLedgerEntriesParams,
} from "@/features/accounting/domain/repositories/ledger-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class LedgerAccountServiceImpl implements LedgerAccountService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListLedgerAccountsParams, session: SessionEntity): Promise<ListLedgerAccountsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.search) searchParams["search"] = params.search;
      if (params.types && params.types.length > 0) searchParams["type"] = params.types.join(",");

      const result = await this.http.request({ path: "/accounting/accounts", method: "GET", searchParams, session });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(LedgerAccountModel.fromJson),
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

  public async getBalance(accountId: string, params: GetAccountBalanceParams, session: SessionEntity): Promise<AccountBalanceModel> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.startDate) searchParams["start_date"] = params.startDate;
      if (params.endDate) searchParams["end_date"] = params.endDate;

      const result = await this.http.request({
        path: `/accounting/accounts/${accountId}/balance`,
        method: "GET",
        searchParams,
        session,
      });

      return AccountBalanceModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listEntries(accountId: string, params: ListLedgerEntriesParams, session: SessionEntity): Promise<ListLedgerEntriesServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.startDate) searchParams["start_date"] = params.startDate;
      if (params.endDate) searchParams["end_date"] = params.endDate;

      const result = await this.http.request({
        path: `/accounting/accounts/${accountId}/ledger`,
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(LedgerEntryModel.fromJson),
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
}
