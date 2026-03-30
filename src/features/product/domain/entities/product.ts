import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";
import { VariantEntity } from "@/features/product/domain/entities/variant";

type ProductMetadata = {
  userActive: boolean;
  recipeComplete: boolean;
};

type ProductEntityConstructor = {
  id: string;
  name: string;
  sku: string;
  type: string;
  productionMode: string | null;
  active: boolean;
  category: ProductCategoryEntity | null;
  photos: ProductPhotoEntity[];
  variants: VariantEntity[];
  metadata: ProductMetadata | null;
  createdAt: string;
  updatedAt: string;
};

export class ProductEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public sku: string;
  public type: string;
  public productionMode: string | null;
  public active: boolean;
  public category: ProductCategoryEntity | null;
  public photos: ProductPhotoEntity[];
  public variants: VariantEntity[];
  public metadata: ProductMetadata | null;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: ProductEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.type = args.type;
    this.productionMode = args.productionMode;
    this.active = args.active;
    this.category = args.category;
    this.photos = args.photos;
    this.variants = args.variants;
    this.metadata = args.metadata;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
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
