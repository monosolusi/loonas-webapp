import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PaginatedData } from "@/core/resources/paginated";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { ProductionRecordRepository } from "@/features/production/domain/repositories/production-record";

type ListProductionRecordsInput = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
  page?: number;
  limit?: number;
};

export class ListProductionRecordsUseCaseParams {
  constructor(public readonly params: ListProductionRecordsInput) {}
}

export class ListProductionRecordsUseCase
  implements UseCase<DataState<PaginatedData<ProductionRecordEntity>>, ListProductionRecordsUseCaseParams>
{
  constructor(
    private readonly productionRecordRepository: ProductionRecordRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(
    params: ListProductionRecordsUseCaseParams,
  ): Promise<DataState<PaginatedData<ProductionRecordEntity>>> {
    try {
      const session = await this.resolveSession();
      return await this.productionRecordRepository.list(params.params, session);
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
