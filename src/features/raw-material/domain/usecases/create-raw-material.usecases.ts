import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { RawMaterialRepository, CreateRawMaterialParams } from "@/features/raw-material/domain/repositories/raw-material";

export class CreateRawMaterialUseCaseParams {
  constructor(public readonly params: CreateRawMaterialParams) {}
}

export class CreateRawMaterialUseCase implements UseCase<DataState<RawMaterialEntity>, CreateRawMaterialUseCaseParams> {
  constructor(
    private readonly rawMaterialRepository: RawMaterialRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateRawMaterialUseCaseParams): Promise<DataState<RawMaterialEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.rawMaterialRepository.create(params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
