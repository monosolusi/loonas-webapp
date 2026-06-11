import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import {
  RawMaterialRepository,
  ListRawMaterialsParams,
  ListRawMaterialsResult,
} from "@/features/raw-material/domain/repositories/raw-material";

export class ListRawMaterialsUseCaseParams {
  constructor(public readonly params: ListRawMaterialsParams) {}
}

export class ListRawMaterialsUseCase
  implements UseCase<DataState<ListRawMaterialsResult>, ListRawMaterialsUseCaseParams>
{
  constructor(
    private readonly rawMaterialRepository: RawMaterialRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListRawMaterialsUseCaseParams): Promise<DataState<ListRawMaterialsResult>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.rawMaterialRepository.list(params.params, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
