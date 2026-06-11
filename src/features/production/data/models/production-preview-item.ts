import { AbstractModel } from "@/core/resources/model";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import { ProductionPreviewItemEntity } from "@/features/production/domain/entities/production-preview-item";

type ProductionPreviewItemModelConstructor = {
  rawMaterial: RawMaterialModel;
  quantity: number;
  unitCost: number;
  totalCost: number;
  currentStock: number;
  sufficient: boolean;
};

export class ProductionPreviewItemModel implements AbstractModel {
  public readonly rawMaterial: RawMaterialModel;
  public readonly quantity: number;
  public readonly unitCost: number;
  public readonly totalCost: number;
  public readonly currentStock: number;
  public readonly sufficient: boolean;

  constructor(args: ProductionPreviewItemModelConstructor) {
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.unitCost = args.unitCost;
    this.totalCost = args.totalCost;
    this.currentStock = args.currentStock;
    this.sufficient = args.sufficient;
  }

  public static fromJson(data: Record<string, any>): ProductionPreviewItemModel {
    return new ProductionPreviewItemModel({
      rawMaterial: RawMaterialModel.fromJson(data["raw_material"]),
      quantity: data["quantity"] ?? 0,
      unitCost: data["unit_cost"] ?? 0,
      totalCost: data["total_cost"] ?? 0,
      currentStock: data["current_stock"] ?? 0,
      sufficient: data["sufficient"] ?? false,
    });
  }

  public toEntity(): ProductionPreviewItemEntity {
    return new ProductionPreviewItemEntity({
      rawMaterial: this.rawMaterial.toEntity(),
      quantity: this.quantity,
      unitCost: this.unitCost,
      totalCost: this.totalCost,
      currentStock: this.currentStock,
      sufficient: this.sufficient,
    });
  }
}
