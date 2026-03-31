import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingRepository, CreateCoaMappingParams } from "@/features/accounting/domain/repositories/coa-mapping";

export class CreateCoaMappingUseCaseParams {
  constructor(
    public readonly entityType: string,
    public readonly debitAccountId: string,
    public readonly creditAccountId: string,
    public readonly entityId?: string,
  ) {}
}

export class CreateCoaMappingUseCase implements UseCase<DataState<CoaMappingEntity>, CreateCoaMappingUseCaseParams> {
  constructor(
    private readonly repo: CoaMappingRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: CreateCoaMappingUseCaseParams): Promise<DataState<CoaMappingEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.createMapping(params, session);
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

  private async createMapping(
    params: CreateCoaMappingUseCaseParams,
    session: SessionEntity,
  ): Promise<DataState<CoaMappingEntity>> {
    const repoParams: CreateCoaMappingParams = {
      entityType: params.entityType,
      entityId: params.entityId,
      debitAccountId: params.debitAccountId,
      creditAccountId: params.creditAccountId,
    };
    return this.repo.create(repoParams, session);
  }
}
