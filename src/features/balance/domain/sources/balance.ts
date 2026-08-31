import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceModel } from "@/features/balance/data/models/balance";

export interface BalanceService {
  get(session: SessionEntity): Promise<BalanceModel>;
}
