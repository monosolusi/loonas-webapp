import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaginatedData } from "@/core/resources/paginated";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingRepository, ListCoaMappingsParams } from "@/features/accounting/domain/repositories/coa-mapping";
import { CoaMappingService } from "@/features/accounting/domain/sources/coa-mapping";

export class CoaMappingRepositoryImpl implements CoaMappingRepository {
  constructor(private readonly service: CoaMappingService) {}

  public async list(
    params: ListCoaMappingsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<CoaMappingEntity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        data: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
