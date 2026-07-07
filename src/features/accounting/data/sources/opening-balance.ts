import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceModel } from "@/features/accounting/data/models/opening-balance";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { OpeningBalanceService, PostOpeningBalanceServiceParams } from "@/features/accounting/domain/sources/opening-balance";
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

  public async post(params: PostOpeningBalanceServiceParams, session: SessionEntity): Promise<JournalModel> {
    try {
      const body = {
        as_of: params.asOf,
        lines: params.lines.map((l) => ({ account_id: l.accountId, debit: l.debit, credit: l.credit })),
      };
      const result = await this.http.request(
        { path: "/accounting/opening-balance", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );
      return JournalModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
