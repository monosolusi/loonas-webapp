import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceEntity } from "@/features/balance/domain/entities/balance";

export interface BalanceRepository {
  get(session: SessionEntity): Promise<DataState<BalanceEntity>>;
}
