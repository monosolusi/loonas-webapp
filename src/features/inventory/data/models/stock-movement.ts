import { AbstractModel } from "@/core/resources/model";
import { StockItemModel } from "@/features/inventory/data/models/stock-item";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";

type StockMovementModelConstructor = {
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
  stockItem: StockItemModel | null;
};

export class StockMovementModel implements AbstractModel {
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
  public readonly stockItem: StockItemModel | null;

  constructor(args: StockMovementModelConstructor) {
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

  public static fromJson(data: Record<string, any>): StockMovementModel {
    const stockItem = data["stock_item"] ? StockItemModel.fromJson(data["stock_item"]) : null;
    return new StockMovementModel({
      id: data["id"],
      type: data["type"],
      quantity: data["quantity"] ?? 0,
      referenceType: data["reference_type"] ?? null,
      referenceId: data["reference_id"] ?? null,
      note: data["note"] ?? null,
      stockItemId: stockItem?.id ?? data["stock_item"]?.["id"] ?? "",
      createdAt: data["created_at"] ?? "",
      reason: data["reason"] ?? null,
      effectiveAt: data["effective_at"] ?? data["created_at"] ?? "",
      stockItem,
    });
  }

  public toEntity(): StockMovementEntity {
    return new StockMovementEntity({
      id: this.id,
      type: this.type,
      quantity: this.quantity,
      referenceType: this.referenceType,
      referenceId: this.referenceId,
      note: this.note,
      stockItemId: this.stockItemId,
      createdAt: this.createdAt,
      reason: this.reason,
      effectiveAt: this.effectiveAt,
      stockItem: this.stockItem?.toEntity() ?? null,
    });
  }
}