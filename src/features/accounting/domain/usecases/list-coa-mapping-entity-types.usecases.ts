import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";
import { CoaMappingEntityTypeRepository } from "@/features/accounting/domain/repositories/coa-mapping-entity-type";

export class ListCoaMappingEntityTypesUseCase
  implements UseCase<DataState<CoaMappingEntityTypeEntity[]>>
{
  constructor(
    private readonly repo: CoaMappingEntityTypeRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<CoaMappingEntityTypeEntity[]>> {
    try {
      const session = await this.resolveSession();
      return await this.fetchEntityTypes(session);
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

  private async fetchEntityTypes(session: SessionEntity): Promise<DataState<CoaMappingEntityTypeEntity[]>> {
    return this.repo.list(session);
  }
}
