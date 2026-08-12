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

  /**
   * The single variant the "Harga Jual" input stands for, or `null` when this product is genuinely
   * multi-variant — or has no variants yet and one must be created.
   *
   * LNS-570: single-price is not a separate storage shape, it is exactly one variant named "Default"
   * — the negation of `hasVariants`. Callers that re-derive that rule from `variants` drift from it.
   * `syncVariants` did: it keyed its synthetic row on the literal "default", never matched a real
   * UUID, and planned every price edit as delete-then-add. Grosir tiers and the recipe hang off the
   * variant id as separate sub-resources, so the variant was reborn under a new id and both were
   * silently destroyed.
   *
   * Deliberately derived FROM `hasVariants` rather than restating its clauses, so the two cannot
   * disagree. `variants[0] ?? null` is exhaustive: `!hasVariants` means zero variants, or exactly
   * one and that one is the Default.
   */
  public get defaultVariant(): VariantEntity | null {
    if (this.hasVariants) return null;
    return this.variants[0] ?? null;
  }

  /**
   * How many variants carry at least one grosir tier.
   *
   * Three-state on purpose:
   * - `null` — no variant carries a hydrated schedule, i.e. this read path does not
   *   expose them. Says NOTHING about whether tiers exist; render no tier affordance.
   * - `0`    — hydrated, and no variant has tiers. Flat-priced.
   * - `> 0`  — that many variants have a schedule.
   */
  public get tieredVariantCount(): number | null {
    const hydrated = this.variants.filter((variant) => variant.priceTierSchedule !== null);
    if (hydrated.length === 0) return null;
    return hydrated.filter((variant) => variant.priceTierSchedule!.hasTiers).length;
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
