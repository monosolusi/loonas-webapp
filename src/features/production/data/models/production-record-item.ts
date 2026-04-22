import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import { ProductionRecordItemEntity } from "@/features/production/domain/entities/production-record-item";

type ProductionRecordItemModelConstructor = {
  id: string;
  rawMaterial: RawMaterialModel;
  quantity: number;
  unitCost: number;
  totalCost: number;
  createdAt: DateTime;
};

export class ProductionRecordItemModel implements AbstractModel {
  public readonly id: string;
  public readonly rawMaterial: RawMaterialModel;
  public readonly quantity: number;
  public readonly unitCost: number;
  public readonly totalCost: number;
  public readonly createdAt: DateTime;

  constructor(args: ProductionRecordItemModelConstructor) {
    this.id = args.id;
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.unitCost = args.unitCost;
    this.totalCost = args.totalCost;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): ProductionRecordItemModel {
    return new ProductionRecordItemModel({
      id: data["id"],
      rawMaterial: RawMaterialModel.fromJson(data["raw_material"]),
      quantity: data["quantity"] ?? 0,
      unitCost: data["unit_cost"] ?? 0,
      totalCost: data["total_cost"] ?? 0,
      createdAt: DateTime.fromISO(data["created_at"] ?? ""),
    });
  }

  public toEntity(): ProductionRecordItemEntity {
    return new ProductionRecordItemEntity({
      id: this.id,
      rawMaterial: this.rawMaterial.toEntity(),
      quantity: this.quantity,
      unitCost: this.unitCost,
      totalCost: this.totalCost,
      createdAt: this.createdAt,
    });
  }
}
