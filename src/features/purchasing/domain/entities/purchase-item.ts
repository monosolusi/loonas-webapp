import { AbstractEntity } from "@/core/resources/entity";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { VariantEntity } from "@/features/product/domain/entities/variant";

type PurchaseItemEntityConstructor = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  rawMaterial: RawMaterialEntity | null;
  variant: VariantEntity | null;
  createdAt: string;
};

export class PurchaseItemEntity implements AbstractEntity {
  public readonly id: string;
  public readonly quantity: number;
  public readonly unitPrice: number;
  public readonly totalPrice: number;
  public readonly rawMaterial: RawMaterialEntity | null;
  public readonly variant: VariantEntity | null;
  public readonly createdAt: string;

  constructor(args: PurchaseItemEntityConstructor) {
    this.id = args.id;
    this.quantity = args.quantity;
    this.unitPrice = args.unitPrice;
    this.totalPrice = args.totalPrice;
    this.rawMaterial = args.rawMaterial;
    this.variant = args.variant;
    this.createdAt = args.createdAt;
  }

  get itemName(): string {
    return this.rawMaterial?.name ?? this.variant?.name ?? "";
  }

  get unit(): string | null {
    return this.rawMaterial?.unit ?? null;
  }
}
