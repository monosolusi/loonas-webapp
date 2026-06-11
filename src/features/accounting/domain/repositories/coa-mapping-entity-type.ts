import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";

export interface CoaMappingEntityTypeRepository {
  list(session: SessionEntity): Promise<DataState<CoaMappingEntityTypeEntity[]>>;
}
