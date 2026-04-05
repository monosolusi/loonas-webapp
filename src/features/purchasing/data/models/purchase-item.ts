import { AbstractModel } from "@/core/resources/model";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import { VariantModel } from "@/features/product/data/models/variant";
import { PurchaseItemEntity } from "@/features/purchasing/domain/entities/purchase-item";

type PurchaseItemModelConstructor = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  rawMaterial: RawMaterialModel | null;
  variant: VariantModel | null;
  createdAt: string;
};

export class PurchaseItemModel implements AbstractModel {
  public readonly id: string;
  public readonly quantity: number;
  public readonly unitPrice: number;
  public readonly totalPrice: number;
  public readonly rawMaterial: RawMaterialModel | null;
  public readonly variant: VariantModel | null;
  public readonly createdAt: string;

  constructor(args: PurchaseItemModelConstructor) {
    this.id = args.id;
    this.quantity = args.quantity;
    this.unitPrice = args.unitPrice;
    this.totalPrice = args.totalPrice;
    this.rawMaterial = args.rawMaterial;
    this.variant = args.variant;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): PurchaseItemModel {
    return new PurchaseItemModel({
      id: data["id"],
      quantity: data["quantity"] ?? 0,
      unitPrice: data["unit_price"] ?? 0,
      totalPrice: data["total_price"] ?? 0,
      rawMaterial: data["raw_material"] ? RawMaterialModel.fromJson(data["raw_material"]) : null,
      variant: data["variant"] ? VariantModel.fromJson(data["variant"]) : null,
      createdAt: data["created_at"] ?? "",
    });
  }

  public toEntity(): PurchaseItemEntity {
    return new PurchaseItemEntity({
      id: this.id,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
      rawMaterial: this.rawMaterial ? this.rawMaterial.toEntity() : null,
      variant: this.variant ? this.variant.toEntity() : null,
      createdAt: this.createdAt,
    });
  }
}
