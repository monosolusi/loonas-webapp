import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceEntity } from "@/features/accounting/domain/entities/opening-balance";

export interface OpeningBalanceRepository {
  get(session: SessionEntity): Promise<DataState<OpeningBalanceEntity | null>>;
}
