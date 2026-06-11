import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";
import { CoaMappingEntityTypeRepository } from "@/features/accounting/domain/repositories/coa-mapping-entity-type";
import { CoaMappingEntityTypeService } from "@/features/accounting/domain/sources/coa-mapping-entity-type";

export class CoaMappingEntityTypeRepositoryImpl implements CoaMappingEntityTypeRepository {
  constructor(private readonly service: CoaMappingEntityTypeService) {}

  public async list(session: SessionEntity): Promise<DataState<CoaMappingEntityTypeEntity[]>> {
    try {
      const result = await this.service.list(session);
      return new DataSuccess(result.map((m) => m.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
