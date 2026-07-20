import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

export type SettleFinalIncomeTaxRepoParams = {
  cashAccountId: string;
  amount: number;
  journalDate: string;
  memo?: string;
  idempotencyKey: string;
};

export interface FinalIncomeTaxSettleRepository {
  settle(params: SettleFinalIncomeTaxRepoParams, session: SessionEntity): Promise<DataState<JournalEntity>>;
}
