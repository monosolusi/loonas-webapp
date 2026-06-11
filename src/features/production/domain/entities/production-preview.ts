import { AbstractEntity } from "@/core/resources/entity";
import { ProductionPreviewItemEntity } from "@/features/production/domain/entities/production-preview-item";

type ProductionPreviewEntityConstructor = {
  quantity: number;
  unitMaterialCost: number;
  totalMaterialCost: number;
  canProduce: boolean;
  items: ProductionPreviewItemEntity[];
};

export class ProductionPreviewEntity implements AbstractEntity {
  public readonly id: string;
  public readonly quantity: number;
  public readonly unitMaterialCost: number;
  public readonly totalMaterialCost: number;
  public readonly canProduce: boolean;
  public readonly items: ProductionPreviewItemEntity[];

  constructor(args: ProductionPreviewEntityConstructor) {
    this.id = `preview-${args.quantity}`;
    this.quantity = args.quantity;
    this.unitMaterialCost = args.unitMaterialCost;
    this.totalMaterialCost = args.totalMaterialCost;
    this.canProduce = args.canProduce;
    this.items = args.items;
  }
}
