import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemRepository } from "@/features/inventory/domain/repositories/stock-item";

export class GetStockItemUseCaseParams {
  constructor(public readonly id: string) {}
}

export class GetStockItemUseCase implements UseCase<DataState<StockItemEntity>, GetStockItemUseCaseParams> {
  constructor(
    private readonly stockItemRepository: StockItemRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetStockItemUseCaseParams): Promise<DataState<StockItemEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.stockItemRepository.get(params.id, session);
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
