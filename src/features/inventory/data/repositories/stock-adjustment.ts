import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import { StockAdjustmentRepository, AdjustStockItemParams } from "@/features/inventory/domain/repositories/stock-adjustment";
import { StockAdjustmentService } from "@/features/inventory/domain/sources/stock-adjustment";

export class StockAdjustmentRepositoryImpl implements StockAdjustmentRepository {
  constructor(private readonly service: StockAdjustmentService) {}

  public async adjust(params: AdjustStockItemParams, session: SessionEntity): Promise<DataState<StockMovementEntity>> {
    try {
      const result = await this.service.adjust(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}