import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

export type SettlePphFinalRepoParams = {
  cashAccountId: string;
  amount: number;
  journalDate: string;
  memo?: string;
  idempotencyKey: string;
};

export interface PphFinalSettleRepository {
  settle(params: SettlePphFinalRepoParams, session: SessionEntity): Promise<DataState<JournalEntity>>;
}
