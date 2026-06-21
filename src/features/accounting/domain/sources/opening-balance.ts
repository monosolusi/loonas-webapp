import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceModel } from "@/features/accounting/data/models/opening-balance";

export interface OpeningBalanceService {
  get(session: SessionEntity): Promise<OpeningBalanceModel | null>;
}
