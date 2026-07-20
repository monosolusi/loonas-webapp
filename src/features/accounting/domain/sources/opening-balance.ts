import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceModel } from "@/features/accounting/data/models/opening-balance";
import { JournalModel } from "@/features/accounting/data/models/journal";

export type PostOpeningBalanceServiceParams = {
  asOf: string;
  lines: { accountId: string; debit: number; credit: number }[];
  idempotencyKey: string;
};

export interface OpeningBalanceService {
  get(session: SessionEntity): Promise<OpeningBalanceModel | null>;
  post(params: PostOpeningBalanceServiceParams, session: SessionEntity): Promise<JournalModel>;
}
