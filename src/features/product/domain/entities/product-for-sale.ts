import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";

type ProductForSaleEntityConstructor = {
  id: string;
  name: string;
  sku: string;
  type: string;
  productionMode: string | null;
  category: ProductCategoryEntity | null;
  photos: ProductPhotoEntity[];
  variants: VariantForSaleEntity[];
  createdAt: string;
  updatedAt: string;
};

export class ProductForSaleEntity implements AbstractEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string;
  public readonly type: string;
  public readonly productionMode: string | null;
  public readonly category: ProductCategoryEntity | null;
  public readonly photos: ProductPhotoEntity[];
  public readonly variants: VariantForSaleEntity[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: ProductForSaleEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.type = args.type;
    this.productionMode = args.productionMode;
    this.category = args.category;
    this.photos = args.photos;
    this.variants = args.variants;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public get hasMultipleVariants(): boolean {
    return this.variants.length > 1;
  }

  public get priceRange(): { min: number; max: number } {
    if (this.variants.length === 0) return { min: 0, max: 0 };
    const prices = this.variants.map((v) => v.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }

  public get displayPrice(): string {
    const { min, max } = this.priceRange;
    if (min === max) return IDRFormatter.toCurrency(min);
    return `${IDRFormatter.toCurrency(min)} - ${IDRFormatter.toCurrency(max)}`;
  }

  /** True if at least one variant is available for sale. */
  public get hasAvailableVariant(): boolean {
    return this.variants.some((v) => v.isAvailable);
  }
}
