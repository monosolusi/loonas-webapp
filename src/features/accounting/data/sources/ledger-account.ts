import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import { AccountBalanceModel } from "@/features/accounting/data/models/account-balance";
import { LedgerEntryModel } from "@/features/accounting/data/models/ledger-entry";
import {
  LedgerAccountService,
  ListLedgerAccountsServiceResult,
  ListLedgerEntriesServiceResult,
  ListLedgerAccountsServiceParams,
  GetAccountBalanceServiceParams,
  ListLedgerEntriesServiceParams,
  CreateLedgerAccountServiceParams,
  UpdateLedgerAccountServiceParams,
  DeleteLedgerAccountServiceParams,
} from "@/features/accounting/domain/sources/ledger-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class LedgerAccountServiceImpl implements LedgerAccountService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListLedgerAccountsServiceParams, session: SessionEntity): Promise<ListLedgerAccountsServiceResult> {
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

  public async getBalance(params: GetAccountBalanceServiceParams, session: SessionEntity): Promise<AccountBalanceModel> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.startDate) searchParams["start_date"] = params.startDate;
      if (params.endDate) searchParams["end_date"] = params.endDate;

      const result = await this.http.request({
        path: `/accounting/accounts/${params.accountId}/balance`,
        method: "GET",
        searchParams,
        session,
      });

      return AccountBalanceModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listEntries(params: ListLedgerEntriesServiceParams, session: SessionEntity): Promise<ListLedgerEntriesServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.startDate) searchParams["from"] = params.startDate;
      if (params.endDate) searchParams["to"] = params.endDate;
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: `/accounting/reports/general-ledger/${params.accountId}`,
        method: "GET",
        searchParams,
        session,
      });

      const data = result?.data;
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      const lines = Array.isArray(data.lines) ? data.lines : [];
      const accountId = data.meta?.account_id ?? params.accountId;

      return {
        data: lines.map((line: any) => LedgerEntryModel.fromJson({ ...line, account_id: accountId })),
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

  public async create(params: CreateLedgerAccountServiceParams, session: SessionEntity): Promise<LedgerAccountModel> {
    try {
      const body: Record<string, any> = {
        code: params.code,
        name: params.name,
        type: params.type,
      };
      if (params.parentId) body["parent"] = { id: params.parentId };

      const result = await this.http.request(
        { path: "/accounting/accounts", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return LedgerAccountModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(params: UpdateLedgerAccountServiceParams, session: SessionEntity): Promise<LedgerAccountModel> {
    try {
      const body: Record<string, any> = {};
      if (params.name !== undefined) body["name"] = params.name;
      if (params.code !== undefined) body["code"] = params.code;
      if (params.type !== undefined) body["type"] = params.type;
      // Three-state sentinel: undefined = omit, null = clear, { id } = set
      if (params.parent !== undefined) body["parent"] = params.parent;

      const result = await this.http.request({
        path: `/accounting/accounts/${params.id}`,
        method: "PUT",
        body,
        session,
      });

      return LedgerAccountModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(params: DeleteLedgerAccountServiceParams, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/accounting/accounts/${params.id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
