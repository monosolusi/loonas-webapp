import { AbstractModel } from "@/core/resources/model";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";

type ProductPhotoModelConstructor = {
  id: string;
  sortOrder: number;
  publicUrl: string;
};

export class ProductPhotoModel implements AbstractModel {
  public readonly id: string;
  public readonly sortOrder: number;
  public readonly publicUrl: string;

  constructor(args: ProductPhotoModelConstructor) {
    this.id = args.id;
    this.sortOrder = args.sortOrder;
    this.publicUrl = args.publicUrl;
  }

  public static fromJson(data: Record<string, any>): ProductPhotoModel {
    return new ProductPhotoModel({
      id: data["id"],
      sortOrder: data["sort_order"] ?? 0,
      publicUrl: data["public_url"] ?? "",
    });
  }

  public toEntity(): ProductPhotoEntity {
    return new ProductPhotoEntity({
      id: this.id,
      sortOrder: this.sortOrder,
      publicUrl: this.publicUrl,
    });
  }
}
