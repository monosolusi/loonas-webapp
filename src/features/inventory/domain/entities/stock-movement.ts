import { AbstractEntity } from "@/core/resources/entity";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

type StockMovementEntityConstructor = {
  id: string;
  type: string;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  note: string | null;
  stockItemId: string;
  createdAt: string;
  reason: string | null;
  effectiveAt: string;
  stockItem: StockItemEntity | null;
};

export class StockMovementEntity implements AbstractEntity {
  public readonly id: string;
  public readonly type: string;
  public readonly quantity: number;
  public readonly referenceType: string | null;
  public readonly referenceId: string | null;
  public readonly note: string | null;
  public readonly stockItemId: string;
  public readonly createdAt: string;
  public readonly reason: string | null;
  public readonly effectiveAt: string;
  public readonly stockItem: StockItemEntity | null;

  constructor(args: StockMovementEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.quantity = args.quantity;
    this.referenceType = args.referenceType;
    this.referenceId = args.referenceId;
    this.note = args.note;
    this.stockItemId = args.stockItemId;
    this.createdAt = args.createdAt;
    this.reason = args.reason;
    this.effectiveAt = args.effectiveAt;
    this.stockItem = args.stockItem;
  }

  get isStockIn(): boolean {
    return this.quantity > 0;
  }
}