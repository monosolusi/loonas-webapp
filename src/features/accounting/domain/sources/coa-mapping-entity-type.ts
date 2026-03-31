import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntityTypeModel } from "@/features/accounting/data/models/coa-mapping-entity-type";

export interface CoaMappingEntityTypeService {
  list(session: SessionEntity): Promise<CoaMappingEntityTypeModel[]>;
}
