import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { ProductStatus } from "@/features/product/domain/enums/product-status";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";
import { ProductVariantEntity } from "@/features/product/domain/entities/product-variant";

type ProductEntityConstructor = {
  id: string;
  name: string;
  sku: string;
  status: string;
  category: ProductCategoryEntity | null;
  photos: ProductPhotoEntity[];
  variants: ProductVariantEntity[];
  createdAt: string;
  updatedAt: string;
};

export class ProductEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public sku: string;
  public status: string;
  public category: ProductCategoryEntity | null;
  public photos: ProductPhotoEntity[];
  public variants: ProductVariantEntity[];
  public createdAt: string;
  public updatedAt: string;

  constructor(args: ProductEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.status = args.status;
    this.category = args.category;
    this.photos = args.photos;
    this.variants = args.variants;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public get isActive(): boolean {
    return this.status === ProductStatus.ACTIVE;
  }

  public get primaryPhoto(): ProductPhotoEntity | null {
    return this.photos.length > 0 ? this.photos[0] : null;
  }

  public get hasVariants(): boolean {
    return this.variants.length > 1 || (this.variants.length === 1 && !this.variants[0].isDefault);
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
}
