import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";

export type SettleFinalIncomeTaxServiceParams = {
  cashAccountId: string;
  amount: number;
  journalDate: string;
  memo?: string;
  idempotencyKey: string;
};

export interface FinalIncomeTaxSettleService {
  settle(params: SettleFinalIncomeTaxServiceParams, session: SessionEntity): Promise<JournalModel>;
}
