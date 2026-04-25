import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { CoaMappingLinePosition } from "@/features/accounting/domain/entities/coa-mapping-line";
import { CoaMappingRepository } from "@/features/accounting/domain/repositories/coa-mapping";

type UpdateCoaMappingLineInput = {
  accountId: string;
  position: CoaMappingLinePosition;
  label?: string;
  sortOrder?: number;
};

type UpdateCoaMappingInput = {
  id: string;
  lines: UpdateCoaMappingLineInput[];
};

export class UpdateCoaMappingUseCaseParams {
  constructor(public readonly params: UpdateCoaMappingInput) {}
}

export class UpdateCoaMappingUseCase
  implements UseCase<DataState<CoaMappingEntity>, UpdateCoaMappingUseCaseParams>
{
  constructor(
    private readonly repo: CoaMappingRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: UpdateCoaMappingUseCaseParams): Promise<DataState<CoaMappingEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.repo.update(params.params, session);
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
}
