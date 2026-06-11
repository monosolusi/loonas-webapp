import { AbstractModel } from "@/core/resources/model";
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

  constructor(args: StockMovementModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.quantity = args.quantity;
    this.referenceType = args.referenceType;
    this.referenceId = args.referenceId;
    this.note = args.note;
    this.stockItemId = args.stockItemId;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): StockMovementModel {
    return new StockMovementModel({
      id: data["id"],
      type: data["type"],
      quantity: data["quantity"] ?? 0,
      referenceType: data["reference_type"] ?? null,
      referenceId: data["reference_id"] ?? null,
      note: data["note"] ?? null,
      stockItemId: data["stock_item"]?.["id"] ?? "",
      createdAt: data["created_at"] ?? "",
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
    });
  }
}
