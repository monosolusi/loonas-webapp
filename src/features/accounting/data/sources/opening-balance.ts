import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceModel } from "@/features/accounting/data/models/opening-balance";
import { OpeningBalanceService } from "@/features/accounting/domain/sources/opening-balance";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class OpeningBalanceServiceImpl implements OpeningBalanceService {
  constructor(private readonly http: HttpRequest) {}

  public async get(session: SessionEntity): Promise<OpeningBalanceModel | null> {
    try {
      const result = await this.http.request({ path: "/accounting/opening-balance", method: "GET", session });
      return OpeningBalanceModel.fromJson(result);
    } catch (err) {
      // 404 means no opening balance was ever posted — treat as empty result, not an error.
      if (err instanceof ServerError && (err.code === ErrorCodes.NOT_FOUND.code || err.httpCode === 404)) {
        return null;
      }
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
