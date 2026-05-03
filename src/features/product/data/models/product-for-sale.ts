import { AbstractModel } from "@/core/resources/model";
import { ProductCategoryModel } from "@/features/product/data/models/product-category";
import { ProductPhotoModel } from "@/features/product/data/models/product-photo";
import { VariantForSaleModel } from "@/features/product/data/models/variant-for-sale";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { ProductType } from "@/features/product/domain/enums/product-type";

type ProductForSaleModelConstructor = {
  id: string;
  name: string;
  sku: string;
  type: string;
  productionMode: string | null;
  category: ProductCategoryModel | null;
  photos: ProductPhotoModel[];
  variants: VariantForSaleModel[];
  createdAt: string;
  updatedAt: string;
};

export class ProductForSaleModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string;
  public readonly type: string;
  public readonly productionMode: string | null;
  public readonly category: ProductCategoryModel | null;
  public readonly photos: ProductPhotoModel[];
  public readonly variants: VariantForSaleModel[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: ProductForSaleModelConstructor) {
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

  public static fromJson(data: Record<string, any>): ProductForSaleModel {
    return new ProductForSaleModel({
      id: data["id"] ?? "",
      name: data["name"] ?? "",
      sku: data["sku"] ?? "",
      type: data["type"] ?? ProductType.TRADING,
      productionMode: data["production_mode"] ?? null,
      category: data["category"] ? ProductCategoryModel.fromJson(data["category"]) : null,
      photos: Array.isArray(data["photos"]) ? data["photos"].map(ProductPhotoModel.fromJson) : [],
      variants: Array.isArray(data["variants"]) ? data["variants"].map(VariantForSaleModel.fromJson) : [],
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): ProductForSaleEntity {
    return new ProductForSaleEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      type: this.type,
      productionMode: this.productionMode,
      category: this.category?.toEntity() ?? null,
      photos: this.photos.map((p) => p.toEntity()),
      variants: this.variants.map((v) => v.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
