import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import { StockAdjustmentRepository } from "@/features/inventory/domain/repositories/stock-adjustment";

export type AdjustStockItemChannel = "counted" | "removed";

export type AdjustStockItemUseCaseInput = {
  stockItemId: string;
  channel: AdjustStockItemChannel;
  quantity: number;
  reason: string;
  note: string | null;
  expectedBookQuantity?: number;
  idempotencyKey: string;
};

export class AdjustStockItemUseCaseParams {
  constructor(public readonly params: AdjustStockItemUseCaseInput) {}
}

export class AdjustStockItemUseCase
  implements UseCase<DataState<StockMovementEntity>, AdjustStockItemUseCaseParams>
{
  constructor(
    private readonly stockAdjustmentRepository: StockAdjustmentRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: AdjustStockItemUseCaseParams): Promise<DataState<StockMovementEntity>> {
    try {
      const session = await this.resolveSession();
      const movement = await this.adjust(params.params, session);
      return new DataSuccess(movement);
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

  private async adjust(
    input: AdjustStockItemUseCaseInput,
    session: SessionEntity,
  ): Promise<StockMovementEntity> {
    const result = await this.stockAdjustmentRepository.adjust(
      {
        stockItemId: input.stockItemId,
        channel: input.channel,
        quantity: input.quantity,
        reason: input.reason,
        note: input.note,
        expectedBookQuantity: input.expectedBookQuantity,
        idempotencyKey: input.idempotencyKey,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}