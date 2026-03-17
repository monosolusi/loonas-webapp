import { AbstractModel } from "@/core/resources/model";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { ProductStatus } from "@/features/product/domain/enums/product-status";
import { ProductCategoryModel } from "@/features/product/data/models/product-category";
import { ProductPhotoModel } from "@/features/product/data/models/product-photo";
import { ProductVariantModel } from "@/features/product/data/models/product-variant";

type ProductModelConstructor = {
  id: string;
  name: string;
  sku: string;
  status: string;
  category: ProductCategoryModel | null;
  photos: ProductPhotoModel[];
  variants: ProductVariantModel[];
  createdAt: string;
  updatedAt: string;
};

export class ProductModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string;
  public readonly status: string;
  public readonly category: ProductCategoryModel | null;
  public readonly photos: ProductPhotoModel[];
  public readonly variants: ProductVariantModel[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: ProductModelConstructor) {
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

  public static fromJson(data: Record<string, any>): ProductModel {
    return new ProductModel({
      id: data["id"],
      name: data["name"],
      sku: data["sku"],
      status: data["status"] ?? ProductStatus.ACTIVE,
      category: data["category"] ? ProductCategoryModel.fromJson(data["category"]) : null,
      photos: Array.isArray(data["photos"]) ? data["photos"].map(ProductPhotoModel.fromJson) : [],
      variants: Array.isArray(data["variants"]) ? data["variants"].map(ProductVariantModel.fromJson) : [],
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): ProductEntity {
    return new ProductEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      status: this.status,
      category: this.category?.toEntity() ?? null,
      photos: this.photos.map((p) => p.toEntity()),
      variants: this.variants.map((v) => v.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
