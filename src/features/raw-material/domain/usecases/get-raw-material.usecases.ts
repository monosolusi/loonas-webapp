import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RawMaterialRepository } from "@/features/raw-material/domain/repositories/raw-material";

export class GetRawMaterialUseCaseParams {
  constructor(public readonly id: string) {}
}

export class GetRawMaterialUseCase implements UseCase<DataState<RawMaterialEntity>, GetRawMaterialUseCaseParams> {
  constructor(
    private readonly rawMaterialRepository: RawMaterialRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetRawMaterialUseCaseParams): Promise<DataState<RawMaterialEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.rawMaterialRepository.get(params.id, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
