import { AbstractEntity } from "@/core/resources/entity";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductEntity } from "@/features/product/domain/entities/product";

type VariantEntityConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  metadata: { hasRecipe?: boolean } | null;
  product: ProductEntity | null;
};

export class VariantEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public sku: string | null;
  public price: number;
  public metadata: { hasRecipe?: boolean } | null;
  public product: ProductEntity | null;

  constructor(args: VariantEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.metadata = args.metadata;
    this.product = args.product;
  }

  public get isDefault(): boolean {
    return this.name === DEFAULT_VARIANT_NAME;
  }

  public get productName(): string | null {
    return this.product?.name ?? null;
  }

  public get productId(): string | null {
    return this.product?.id ?? null;
  }
}
