import { AbstractModel } from "@/core/resources/model";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";
import { StockStatus } from "@/features/product/domain/enums/stock-status";
import { PriceTierScheduleModel } from "@/features/product/data/models/price-tier-schedule";

type VariantForSaleModelConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  stockStatus: StockStatus;
  currentStock: number | null;
  maxMakeable: number | null;
  priceTierSchedule: PriceTierScheduleModel | null;
};

const REASON_VALUES = new Set<string>(Object.values(UnavailableReason));
const STOCK_STATUS_VALUES = new Set<string>(Object.values(StockStatus));

function parseUnavailableReason(value: unknown): UnavailableReason | null {
  if (typeof value !== "string") return null;
  return REASON_VALUES.has(value) ? (value as UnavailableReason) : null;
}

// The contract promises `stock_status` is always present, but default defensively to `UNKNOWN`
// (the spec's own fallback for a configuration gap or unevaluated read) on a malformed payload.
function parseStockStatus(value: unknown): StockStatus {
  if (typeof value !== "string") return StockStatus.UNKNOWN;
  return STOCK_STATUS_VALUES.has(value) ? (value as StockStatus) : StockStatus.UNKNOWN;
}

export class VariantForSaleModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string | null;
  public readonly price: number;
  public readonly isAvailable: boolean;
  public readonly unavailableReason: UnavailableReason | null;
  public readonly stockStatus: StockStatus;
  public readonly currentStock: number | null;
  public readonly maxMakeable: number | null;
  public readonly priceTierSchedule: PriceTierScheduleModel | null;

  constructor(args: VariantForSaleModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.isAvailable = args.isAvailable;
    this.unavailableReason = args.unavailableReason;
    this.stockStatus = args.stockStatus;
    this.currentStock = args.currentStock;
    this.maxMakeable = args.maxMakeable;
    this.priceTierSchedule = args.priceTierSchedule;
  }

  public static fromJson(data: Record<string, any>): VariantForSaleModel {
    return new VariantForSaleModel({
      id: data["id"] ?? "",
      name: data["name"] ?? "",
      sku: data["sku"] ?? null,
      price: data["price"] ?? 0,
      isAvailable: data["is_available"] ?? false,
      unavailableReason: parseUnavailableReason(data["unavailable_reason"]),
      stockStatus: parseStockStatus(data["stock_status"]),
      currentStock: typeof data["current_stock"] === "number" ? data["current_stock"] : null,
      maxMakeable: typeof data["max_makeable"] === "number" ? data["max_makeable"] : null,
      // Routed through the same parser as VariantModel so the two mappers cannot diverge.
      priceTierSchedule: PriceTierScheduleModel.fromVariantJson(data),
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
      stockStatus: this.stockStatus,
      currentStock: this.currentStock,
      maxMakeable: this.maxMakeable,
      priceTierSchedule: this.priceTierSchedule?.toEntity() ?? null,
    });
  }
}
