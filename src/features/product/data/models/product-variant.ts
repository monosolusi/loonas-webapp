import { AbstractModel } from "@/core/resources/model";
import { ProductVariantEntity } from "@/features/product/domain/entities/product-variant";

type ProductVariantModelConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
};

export class ProductVariantModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string | null;
  public readonly price: number;

  constructor(args: ProductVariantModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
  }

  public static fromJson(data: Record<string, any>): ProductVariantModel {
    return new ProductVariantModel({
      id: data["id"],
      name: data["name"],
      sku: data["sku"] ?? null,
      price: data["price"],
    });
  }

  public toEntity(): ProductVariantEntity {
    return new ProductVariantEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      price: this.price,
    });
  }
}
