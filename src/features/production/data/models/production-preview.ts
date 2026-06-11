import { AbstractModel } from "@/core/resources/model";
import { ProductionPreviewItemModel } from "@/features/production/data/models/production-preview-item";
import { ProductionPreviewEntity } from "@/features/production/domain/entities/production-preview";

type ProductionPreviewModelConstructor = {
  quantity: number;
  unitMaterialCost: number;
  totalMaterialCost: number;
  canProduce: boolean;
  items: ProductionPreviewItemModel[];
};

export class ProductionPreviewModel implements AbstractModel {
  public readonly quantity: number;
  public readonly unitMaterialCost: number;
  public readonly totalMaterialCost: number;
  public readonly canProduce: boolean;
  public readonly items: ProductionPreviewItemModel[];

  constructor(args: ProductionPreviewModelConstructor) {
    this.quantity = args.quantity;
    this.unitMaterialCost = args.unitMaterialCost;
    this.totalMaterialCost = args.totalMaterialCost;
    this.canProduce = args.canProduce;
    this.items = args.items;
  }

  public static fromJson(data: Record<string, any>): ProductionPreviewModel {
    const items = Array.isArray(data["items"]) ? data["items"].map(ProductionPreviewItemModel.fromJson) : [];

    return new ProductionPreviewModel({
      quantity: data["quantity"] ?? 0,
      unitMaterialCost: data["unit_material_cost"] ?? 0,
      totalMaterialCost: data["total_material_cost"] ?? 0,
      canProduce: data["can_produce"] ?? false,
      items,
    });
  }

  public toEntity(): ProductionPreviewEntity {
    return new ProductionPreviewEntity({
      quantity: this.quantity,
      unitMaterialCost: this.unitMaterialCost,
      totalMaterialCost: this.totalMaterialCost,
      canProduce: this.canProduce,
      items: this.items.map((item) => item.toEntity()),
    });
  }
}
