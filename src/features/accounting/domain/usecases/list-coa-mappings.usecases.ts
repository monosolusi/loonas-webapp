import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingRepository, ListCoaMappingsParams } from "@/features/accounting/domain/repositories/coa-mapping";

export class ListCoaMappingsUseCaseParams {
  constructor(public readonly params: ListCoaMappingsParams) {}
}

export class ListCoaMappingsUseCase
  implements UseCase<DataState<PaginatedData<CoaMappingEntity>>, ListCoaMappingsUseCaseParams>
{
  constructor(
    private readonly repo: CoaMappingRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: ListCoaMappingsUseCaseParams): Promise<DataState<PaginatedData<CoaMappingEntity>>> {
    try {
      const session = await this.resolveSession();
      return await this.fetchMappings(params.params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async fetchMappings(
    params: ListCoaMappingsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<CoaMappingEntity>>> {
    return this.repo.list(params, session);
  }
}
