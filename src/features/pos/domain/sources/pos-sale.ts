import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PosSaleModel } from "@/features/pos/data/models/pos-sale";
import { CreatePosSaleParams, GetPosSaleParams } from "@/features/pos/domain/repositories/pos-sale";

export interface PosSaleService {
  create(params: CreatePosSaleParams, session: SessionEntity): Promise<PosSaleModel>;
  get(params: GetPosSaleParams, session: SessionEntity): Promise<PosSaleModel>;
}
