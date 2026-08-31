import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceModel } from "@/features/balance/data/models/balance";
import { BalanceService } from "@/features/balance/domain/sources/balance";

export class BalanceServiceImpl implements BalanceService {
  constructor(private readonly http: HttpRequest) {}

  public async get(session: SessionEntity): Promise<BalanceModel> {
    try {
      // Bare path, no searchParams, no body — the account is resolved from the JWT orgId
      // server-side, so no merchant identifier is ever addressed here.
      const result = await this.http.request({ path: "/balance", method: "GET", session });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return BalanceModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
