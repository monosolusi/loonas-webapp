import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { ProductionRecordRepository } from "@/features/production/domain/repositories/production-record";

export class GetProductionRecordUseCaseParams {
  constructor(public readonly id: string) {}
}

export class GetProductionRecordUseCase
  implements UseCase<DataState<ProductionRecordEntity>, GetProductionRecordUseCaseParams>
{
  constructor(
    private readonly productionRecordRepository: ProductionRecordRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetProductionRecordUseCaseParams): Promise<DataState<ProductionRecordEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.productionRecordRepository.get(params.id, session);
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
