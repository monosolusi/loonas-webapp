import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";

export type AdjustStockItemParams = {
  stockItemId: string;
  channel: "counted" | "removed";
  quantity: number;
  reason: string;
  note: string | null;
  expectedBookQuantity?: number;
  idempotencyKey: string;
};

export interface StockAdjustmentRepository {
  adjust(params: AdjustStockItemParams, session: SessionEntity): Promise<DataState<StockMovementEntity>>;
}