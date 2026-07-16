import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";
import {
  FinalIncomeTaxSettleService,
  SettleFinalIncomeTaxServiceParams,
} from "@/features/accounting/domain/sources/final-income-tax-settle";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class FinalIncomeTaxSettleServiceImpl implements FinalIncomeTaxSettleService {
  constructor(private readonly http: HttpRequest) {}

  public async settle(params: SettleFinalIncomeTaxServiceParams, session: SessionEntity): Promise<JournalModel> {
    try {
      const body: Record<string, any> = {
        cash_account: { id: params.cashAccountId },
        amount: params.amount,
        journal_date: params.journalDate,
      };
      if (params.memo !== undefined && params.memo !== "") {
        body["memo"] = params.memo;
      }

      const result = await this.http.request(
        { path: "/accounting/final-income-tax-settle", method: "POST", body, session },
        { headers: { "Idempotency-Key": params.idempotencyKey } },
      );

      return JournalModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
