import { AbstractModel } from "@/core/resources/model";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";

type VariantForSaleModelConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  currentStock: number | null;
  maxMakeable: number | null;
};

const REASON_VALUES = new Set<string>(Object.values(UnavailableReason));

function parseUnavailableReason(value: unknown): UnavailableReason | null {
  if (typeof value !== "string") return null;
  return REASON_VALUES.has(value) ? (value as UnavailableReason) : null;
}

export class VariantForSaleModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string | null;
  public readonly price: number;
  public readonly isAvailable: boolean;
  public readonly unavailableReason: UnavailableReason | null;
  public readonly currentStock: number | null;
  public readonly maxMakeable: number | null;

  constructor(args: VariantForSaleModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.isAvailable = args.isAvailable;
    this.unavailableReason = args.unavailableReason;
    this.currentStock = args.currentStock;
    this.maxMakeable = args.maxMakeable;
  }

  public static fromJson(data: Record<string, any>): VariantForSaleModel {
    return new VariantForSaleModel({
      id: data["id"] ?? "",
      name: data["name"] ?? "",
      sku: data["sku"] ?? null,
      price: data["price"] ?? 0,
      isAvailable: data["is_available"] ?? false,
      unavailableReason: parseUnavailableReason(data["unavailable_reason"]),
      currentStock: typeof data["current_stock"] === "number" ? data["current_stock"] : null,
      maxMakeable: typeof data["max_makeable"] === "number" ? data["max_makeable"] : null,
    });
  }

  public toEntity(): VariantForSaleEntity {
    return new VariantForSaleEntity({
      id: this.id,
      name: this.name,
      sku: this.sku,
      price: this.price,
      isAvailable: this.isAvailable,
      unavailableReason: this.unavailableReason,
      currentStock: this.currentStock,
      maxMakeable: this.maxMakeable,
    });
  }
}
