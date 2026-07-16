import { AbstractEntity } from "@/core/resources/entity";

type StockItemRawMaterialRef = {
  id: string;
  name: string;
  unit: string;
};

type StockItemVariantRef = {
  id: string;
  name: string;
  productName: string | null;
  sku: string | null;
};

type StockItemEntityConstructor = {
  id: string;
  type: string;
  rawMaterial: StockItemRawMaterialRef | null;
  variant: StockItemVariantRef | null;
  currentStock: number;
  minStock: number | null;
  createdAt: string;
  updatedAt: string;
};

export class StockItemEntity implements AbstractEntity {
  public readonly id: string;
  public readonly type: string;
  public readonly rawMaterial: StockItemRawMaterialRef | null;
  public readonly variant: StockItemVariantRef | null;
  public readonly currentStock: number;
  public readonly minStock: number | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: StockItemEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.rawMaterial = args.rawMaterial;
    this.variant = args.variant;
    this.currentStock = args.currentStock;
    this.minStock = args.minStock;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  get isLowStock(): boolean {
    return this.minStock !== null && this.minStock > 0 && this.currentStock <= this.minStock;
  }

  get itemName(): string {
    if (this.rawMaterial) return this.rawMaterial.name;
    if (this.variant) return this.variant.productName ?? this.variant.name;
    return "";
  }

  get variantName(): string | null {
    return this.variant?.name ?? null;
  }

  get sku(): string | null {
    return this.variant?.sku ?? null;
  }
}
