import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingRepository } from "@/features/accounting/domain/repositories/coa-mapping";

type ListCoaMappingsUseCaseInput = { page?: number; limit?: number; entityType?: string };

export class ListCoaMappingsUseCaseParams {
  constructor(public readonly params: ListCoaMappingsUseCaseInput) {}
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
      return new DataSuccess(await this.fetchMappings(params.params, session));
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
    params: ListCoaMappingsUseCaseInput,
    session: SessionEntity,
  ): Promise<PaginatedData<CoaMappingEntity>> {
    const result = await this.repo.list(params, session);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
