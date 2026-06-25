import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";

export type SettlePphFinalServiceParams = {
  cashAccountId: string;
  amount: number;
  journalDate: string;
  memo?: string;
  idempotencyKey: string;
};

export interface PphFinalSettleService {
  settle(params: SettlePphFinalServiceParams, session: SessionEntity): Promise<JournalModel>;
}
