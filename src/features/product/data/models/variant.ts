import { AbstractModel } from "@/core/resources/model";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { ProductModel } from "@/features/product/data/models/product";
import { PriceTierScheduleModel } from "@/features/product/data/models/price-tier-schedule";

type VariantModelConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  metadata: { hasRecipe?: boolean } | null;
  product: ProductModel | null;
  priceTierSchedule: PriceTierScheduleModel | null;
};

export class VariantModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string | null;
  public readonly price: number;
  public readonly metadata: { hasRecipe?: boolean } | null;
  public readonly product: ProductModel | null;
  public readonly priceTierSchedule: PriceTierScheduleModel | null;

  constructor(args: VariantModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.metadata = args.metadata;
    this.product = args.product;
    this.priceTierSchedule = args.priceTierSchedule;
  }

  public static fromJson(data: Record<string, any>): VariantModel {
    return new VariantModel({
      id: data["id"],
      name: data["name"] ?? "",
      sku: data["sku"] ?? null,
      price: data["price"] ?? 0,
      metadata: data["metadata"] ? { hasRecipe: data["metadata"]["has_recipe"] } : null,
      product: data["product"] ? ProductModel.fromJson(data["product"]) : null,
      // Deliberately NOT `?? []` — absent and empty are different statements. See
      // PriceTierScheduleModel.fromVariantJson.
      priceTierSchedule: PriceTierScheduleModel.fromVariantJson(data),
    });
  }

  public toEntity(): VariantEntity {
    return new VariantEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      price: this.price,
      metadata: this.metadata,
      product: this.product?.toEntity() ?? null,
      priceTierSchedule: this.priceTierSchedule?.toEntity() ?? null,
    });
  }
}
