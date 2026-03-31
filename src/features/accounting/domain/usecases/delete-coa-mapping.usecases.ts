import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CoaMappingRepository } from "@/features/accounting/domain/repositories/coa-mapping";

export class DeleteCoaMappingUseCaseParams {
  constructor(public readonly id: string) {}
}

export class DeleteCoaMappingUseCase implements UseCase<DataState<void>, DeleteCoaMappingUseCaseParams> {
  constructor(
    private readonly repo: CoaMappingRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: DeleteCoaMappingUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.resolveSession();
      return await this.deleteMapping(params.id, session);
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

  private async deleteMapping(id: string, session: SessionEntity): Promise<DataState<void>> {
    return this.repo.delete(id, session);
  }
}
