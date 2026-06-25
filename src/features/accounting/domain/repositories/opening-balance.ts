import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceEntity } from "@/features/accounting/domain/entities/opening-balance";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

export type PostOpeningBalanceRepoParams = {
  asOf: string;
  lines: { accountId: string; debit: number; credit: number }[];
  idempotencyKey: string;
};

export interface OpeningBalanceRepository {
  get(session: SessionEntity): Promise<DataState<OpeningBalanceEntity | null>>;
  post(params: PostOpeningBalanceRepoParams, session: SessionEntity): Promise<DataState<JournalEntity>>;
}
