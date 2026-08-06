import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockMovementModel } from "@/features/inventory/data/models/stock-movement";

export type AdjustStockItemServiceParams = {
  stockItemId: string;
  channel: "counted" | "removed";
  quantity: number;
  reason: string;
  note: string | null;
  expectedBookQuantity?: number;
  idempotencyKey: string;
};

export interface StockAdjustmentService {
  adjust(params: AdjustStockItemServiceParams, session: SessionEntity): Promise<StockMovementModel>;
}