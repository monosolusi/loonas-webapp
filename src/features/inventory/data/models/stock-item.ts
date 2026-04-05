import { AbstractModel } from "@/core/resources/model";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import { VariantModel } from "@/features/product/data/models/variant";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

type StockItemModelConstructor = {
  id: string;
  type: string;
  rawMaterial: RawMaterialModel | null;
  variant: VariantModel | null;
  currentStock: number;
  minStock: number | null;
  createdAt: string;
  updatedAt: string;
};

export class StockItemModel implements AbstractModel {
  public readonly id: string;
  public readonly type: string;
  public readonly rawMaterial: RawMaterialModel | null;
  public readonly variant: VariantModel | null;
  public readonly currentStock: number;
  public readonly minStock: number | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: StockItemModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.rawMaterial = args.rawMaterial;
    this.variant = args.variant;
    this.currentStock = args.currentStock;
    this.minStock = args.minStock;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): StockItemModel {
    return new StockItemModel({
      id: data["id"],
      type: data["type"],
      rawMaterial: data["raw_material"] ? RawMaterialModel.fromJson(data["raw_material"]) : null,
      variant: data["variant"] ? VariantModel.fromJson(data["variant"]) : null,
      currentStock: data["current_stock"] ?? 0,
      minStock: data["min_stock"] ?? null,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): StockItemEntity {
    return new StockItemEntity({
      id: this.id,
      type: this.type,
      rawMaterial: this.rawMaterial
        ? { id: this.rawMaterial.id, name: this.rawMaterial.name, unit: this.rawMaterial.unit }
        : null,
      variant: this.variant ? { id: this.variant.id, name: this.variant.name, productName: this.variant.productName } : null,
      currentStock: this.currentStock,
      minStock: this.minStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
