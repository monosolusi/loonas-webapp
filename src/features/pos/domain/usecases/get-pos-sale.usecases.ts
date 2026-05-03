import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { PosSaleRepository } from "@/features/pos/domain/repositories/pos-sale";

export class GetPosSaleUseCaseParams {
  constructor(public readonly id: string) {}
}

export class GetPosSaleUseCase implements UseCase<DataState<PosSaleEntity>, GetPosSaleUseCaseParams> {
  constructor(
    private readonly posSaleRepository: PosSaleRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetPosSaleUseCaseParams): Promise<DataState<PosSaleEntity>> {
    try {
      const session = await this.resolveSession();
      const sale = await this.getSale(params, session);
      return new DataSuccess(sale);
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

  private async getSale(params: GetPosSaleUseCaseParams, session: SessionEntity): Promise<PosSaleEntity> {
    const result = await this.posSaleRepository.get({ id: params.id }, session);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
