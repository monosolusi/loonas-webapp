import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntrySettingsModel } from "@/features/accounting/data/models/cash-entry-settings-model";
import {
  CashEntrySettingsService,
  UpdateCashEntrySettingsServiceParams,
} from "@/features/accounting/domain/sources/cash-entry-settings";

export class CashEntrySettingsServiceImpl implements CashEntrySettingsService {
  constructor(private readonly http: HttpRequest) {}

  public async get(session: SessionEntity): Promise<CashEntrySettingsModel> {
    try {
      const result = await this.http.request({ path: "/accounting/cash-entry-settings", method: "GET", session });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashEntrySettingsModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(
    params: UpdateCashEntrySettingsServiceParams,
    session: SessionEntity,
  ): Promise<CashEntrySettingsModel> {
    try {
      // Partial update: an omitted key leaves the default unchanged, while an explicit `null`
      // clears it. The distinction only survives serialization if the body is built key by
      // key — a `body: params` passthrough plus JSON.stringify would silently turn a clear
      // into a no-op (LNS-573).
      const body: Record<string, any> = {};
      if (params.defaultIncomeAccountId !== undefined) {
        body["default_income_account_id"] = params.defaultIncomeAccountId;
      }
      if (params.defaultExpenseAccountId !== undefined) {
        body["default_expense_account_id"] = params.defaultExpenseAccountId;
      }

      const result = await this.http.request({
        path: "/accounting/cash-entry-settings",
        method: "PATCH",
        body,
        session,
      });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashEntrySettingsModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
