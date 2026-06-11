import { AbstractEntity } from "@/core/resources/entity";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

type ProductionPreviewItemEntityConstructor = {
  rawMaterial: RawMaterialEntity;
  quantity: number;
  unitCost: number;
  totalCost: number;
  currentStock: number;
  sufficient: boolean;
};

export class ProductionPreviewItemEntity implements AbstractEntity {
  public readonly id: string;
  public readonly rawMaterial: RawMaterialEntity;
  public readonly quantity: number;
  public readonly unitCost: number;
  public readonly totalCost: number;
  public readonly currentStock: number;
  public readonly sufficient: boolean;

  constructor(args: ProductionPreviewItemEntityConstructor) {
    this.id = args.rawMaterial.id;
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.unitCost = args.unitCost;
    this.totalCost = args.totalCost;
    this.currentStock = args.currentStock;
    this.sufficient = args.sufficient;
  }
}
