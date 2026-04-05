import { AbstractEntity } from "@/core/resources/entity";

type StockMovementEntityConstructor = {
  id: string;
  type: string;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  note: string | null;
  stockItemId: string;
  createdAt: string;
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

  constructor(args: StockMovementEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.quantity = args.quantity;
    this.referenceType = args.referenceType;
    this.referenceId = args.referenceId;
    this.note = args.note;
    this.stockItemId = args.stockItemId;
    this.createdAt = args.createdAt;
  }

  get isStockIn(): boolean {
    return this.quantity > 0;
  }
}
