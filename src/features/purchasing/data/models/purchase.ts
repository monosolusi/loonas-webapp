import { AbstractModel } from "@/core/resources/model";
import { PurchaseItemModel } from "@/features/purchasing/data/models/purchase-item";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";

type PurchaseModelConstructor = {
  id: string;
  date: string;
  note: string | null;
  totalAmount: number;
  items: PurchaseItemModel[];
  createdAt: string;
  updatedAt: string;
};

export class PurchaseModel implements AbstractModel {
  public readonly id: string;
  public readonly date: string;
  public readonly note: string | null;
  public readonly totalAmount: number;
  public readonly items: PurchaseItemModel[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PurchaseModelConstructor) {
    this.id = args.id;
    this.date = args.date;
    this.note = args.note;
    this.totalAmount = args.totalAmount;
    this.items = args.items;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): PurchaseModel {
    const items = Array.isArray(data["items"]) ? data["items"].map(PurchaseItemModel.fromJson) : [];

    return new PurchaseModel({
      id: data["id"],
      date: data["date"] ?? "",
      note: data["note"] ?? null,
      totalAmount: data["total_amount"] ?? 0,
      items,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): PurchaseEntity {
    return new PurchaseEntity({
      id: this.id,
      date: this.date,
      note: this.note,
      totalAmount: this.totalAmount,
      items: this.items.map((item) => item.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
