import { AbstractModel } from "@/core/resources/model";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductCategoryModel } from "@/features/product/data/models/product-category";
import { ProductPhotoModel } from "@/features/product/data/models/product-photo";
import { VariantModel } from "@/features/product/data/models/variant";

type ProductMetadataModel = {
  userActive: boolean;
  recipeComplete: boolean;
};

type ProductModelConstructor = {
  id: string;
  name: string;
  sku: string;
  type: string;
  productionMode: string | null;
  active: boolean;
  category: ProductCategoryModel | null;
  photos: ProductPhotoModel[];
  variants: VariantModel[];
  metadata: ProductMetadataModel | null;
  createdAt: string;
  updatedAt: string;
};

export class ProductModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string;
  public readonly type: string;
  public readonly productionMode: string | null;
  public readonly active: boolean;
  public readonly category: ProductCategoryModel | null;
  public readonly photos: ProductPhotoModel[];
  public readonly variants: VariantModel[];
  public readonly metadata: ProductMetadataModel | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: ProductModelConstructor) {
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

  private static parseMetadata(data: Record<string, any> | undefined): ProductMetadataModel | null {
    if (!data) return null;
    return {
      userActive: data["user_active"],
      recipeComplete: data["recipe_complete"],
    };
  }

  public static fromJson(data: Record<string, any>): ProductModel {
    return new ProductModel({
      id: data["id"],
      name: data["name"],
      sku: data["sku"],
      type: data["type"] ?? ProductType.TRADING,
      productionMode: data["production_mode"] ?? null,
      active: data["active"] ?? true,
      category: data["category"] ? ProductCategoryModel.fromJson(data["category"]) : null,
      photos: Array.isArray(data["photos"]) ? data["photos"].map(ProductPhotoModel.fromJson) : [],
      variants: Array.isArray(data["variants"]) ? data["variants"].map(VariantModel.fromJson) : [],
      metadata: ProductModel.parseMetadata(data["metadata"]),
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): ProductEntity {
    return new ProductEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      type: this.type,
      productionMode: this.productionMode,
      active: this.active,
      category: this.category?.toEntity() ?? null,
      photos: this.photos.map((p) => p.toEntity()),
      variants: this.variants.map((v) => v.toEntity()),
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
