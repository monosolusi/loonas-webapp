import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import {
  ListPosSalesResult,
  PosSaleRepository,
} from "@/features/pos/domain/repositories/pos-sale";

export class ListPosSalesUseCaseParams {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

export class ListPosSalesUseCase
  implements UseCase<DataState<ListPosSalesResult>, ListPosSalesUseCaseParams>
{
  constructor(
    private readonly posSaleRepository: PosSaleRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListPosSalesUseCaseParams): Promise<DataState<ListPosSalesResult>> {
    try {
      const session = await this.resolveSession();
      const result = await this.fetchList(params, session);
      return new DataSuccess(result);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async fetchList(params: ListPosSalesUseCaseParams, session: SessionEntity): Promise<ListPosSalesResult> {
    const result = await this.posSaleRepository.list(
      { page: params.page, limit: params.limit },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
