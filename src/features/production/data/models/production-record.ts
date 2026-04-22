import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { VariantModel } from "@/features/product/data/models/variant";
import { ProductionRecordItemModel } from "@/features/production/data/models/production-record-item";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";

type ProductionRecordModelConstructor = {
  id: string;
  quantity: number;
  unitMaterialCost: number;
  totalMaterialCost: number;
  producedAt: DateTime;
  note: string | null;
  variant: VariantModel;
  items: ProductionRecordItemModel[];
  createdAt: DateTime;
  updatedAt: DateTime;
};

export class ProductionRecordModel implements AbstractModel {
  public readonly id: string;
  public readonly quantity: number;
  public readonly unitMaterialCost: number;
  public readonly totalMaterialCost: number;
  public readonly producedAt: DateTime;
  public readonly note: string | null;
  public readonly variant: VariantModel;
  public readonly items: ProductionRecordItemModel[];
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;

  constructor(args: ProductionRecordModelConstructor) {
    this.id = args.id;
    this.quantity = args.quantity;
    this.unitMaterialCost = args.unitMaterialCost;
    this.totalMaterialCost = args.totalMaterialCost;
    this.producedAt = args.producedAt;
    this.note = args.note;
    this.variant = args.variant;
    this.items = args.items;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): ProductionRecordModel {
    const items = Array.isArray(data["items"]) ? data["items"].map(ProductionRecordItemModel.fromJson) : [];

    return new ProductionRecordModel({
      id: data["id"],
      quantity: data["quantity"] ?? 0,
      unitMaterialCost: data["unit_material_cost"] ?? 0,
      totalMaterialCost: data["total_material_cost"] ?? 0,
      producedAt: DateTime.fromISO(data["produced_at"] ?? ""),
      note: data["note"] ?? null,
      variant: VariantModel.fromJson(data["variant"]),
      items,
      createdAt: DateTime.fromISO(data["created_at"] ?? ""),
      updatedAt: DateTime.fromISO(data["updated_at"] ?? ""),
    });
  }

  public toEntity(): ProductionRecordEntity {
    return new ProductionRecordEntity({
      id: this.id,
      quantity: this.quantity,
      unitMaterialCost: this.unitMaterialCost,
      totalMaterialCost: this.totalMaterialCost,
      producedAt: this.producedAt,
      note: this.note,
      variant: this.variant.toEntity(),
      items: this.items.map((item) => item.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
