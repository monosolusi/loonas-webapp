import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OverheadAccountSelectionModel } from "@/features/accounting/data/models/overhead-account-selection";
import {
  OverheadAccountService,
  ReplaceOverheadAccountsServiceParams,
} from "@/features/accounting/domain/sources/overhead-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class OverheadAccountServiceImpl implements OverheadAccountService {
  constructor(private readonly http: HttpRequest) {}

  public async list(session: SessionEntity): Promise<OverheadAccountSelectionModel[]> {
    try {
      const result = await this.http.request({ path: "/accounting/overhead-accounts", method: "GET", session });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return items.map(OverheadAccountSelectionModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async replace(
    params: ReplaceOverheadAccountsServiceParams,
    session: SessionEntity,
  ): Promise<OverheadAccountSelectionModel[]> {
    try {
      // Built explicitly — never `body: params` passthrough. The wire shape nests each id
      // under `coa_accounts[].id`, which is the ACCOUNT id (never the selection-row id).
      const body: Record<string, any> = {
        coa_accounts: params.accountIds.map((id) => ({ id })),
      };

      const result = await this.http.request({
        path: "/accounting/overhead-accounts",
        method: "PUT",
        body,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return items.map(OverheadAccountSelectionModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
