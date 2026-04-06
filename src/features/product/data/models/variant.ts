import { AbstractModel } from "@/core/resources/model";
import { VariantEntity } from "@/features/product/domain/entities/variant";

type VariantModelConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  metadata: { hasRecipe?: boolean } | null;
  productName: string | null;
};

export class VariantModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string | null;
  public readonly price: number;
  public readonly metadata: { hasRecipe?: boolean } | null;
  public readonly productName: string | null;

  constructor(args: VariantModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.metadata = args.metadata;
    this.productName = args.productName;
  }

  public static fromJson(data: Record<string, any>): VariantModel {
    return new VariantModel({
      id: data["id"],
      name: data["name"],
      sku: data["sku"] ?? null,
      price: data["price"],
      metadata: data["metadata"] ? { hasRecipe: data["metadata"]["has_recipe"] } : null,
      productName: data["product"]?.["name"] ?? null,
    });
  }

  public toEntity(): VariantEntity {
    return new VariantEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      price: this.price,
      metadata: this.metadata,
      productName: this.productName,
    });
  }
}
