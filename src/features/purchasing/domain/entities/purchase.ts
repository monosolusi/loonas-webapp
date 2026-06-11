import { AbstractEntity } from "@/core/resources/entity";
import { PurchaseItemEntity } from "@/features/purchasing/domain/entities/purchase-item";

type PurchaseEntityConstructor = {
  id: string;
  date: string;
  note: string | null;
  totalAmount: number;
  items: PurchaseItemEntity[];
  createdAt: string;
  updatedAt: string;
};

export class PurchaseEntity implements AbstractEntity {
  public readonly id: string;
  public readonly date: string;
  public readonly note: string | null;
  public readonly totalAmount: number;
  public readonly items: PurchaseItemEntity[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PurchaseEntityConstructor) {
    this.id = args.id;
    this.date = args.date;
    this.note = args.note;
    this.totalAmount = args.totalAmount;
    this.items = args.items;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
