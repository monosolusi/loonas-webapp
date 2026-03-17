import { AbstractModel } from "@/core/resources/model";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";

type ProductCategoryModelConstructor = {
  id: string;
  name: string;
};

export class ProductCategoryModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;

  constructor(args: ProductCategoryModelConstructor) {
    this.id = args.id;
    this.name = args.name;
  }

  public static fromJson(data: Record<string, any>): ProductCategoryModel {
    return new ProductCategoryModel({
      id: data["id"],
      name: data["name"],
    });
  }

  public toEntity(): ProductCategoryEntity {
    return new ProductCategoryEntity({
      id: this.id,
      name: this.name,
    });
  }
}
