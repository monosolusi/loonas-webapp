import { DateTime } from "luxon";
import { InvoiceItemEntity } from "@/features/invoice/domain/entities/invoice-item";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { AbstractModel } from "@/core/resources/model";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PriceSource, PriceSourceType } from "@/features/invoice/domain/enums/price-source";

const PRICE_SOURCE_VALUES = new Set<string>(Object.values(PriceSource));

function parsePriceSource(value: unknown): PriceSourceType | null {
  return typeof value === "string" && PRICE_SOURCE_VALUES.has(value) ? (value as PriceSourceType) : null;
}

/**
 * Nullable number parse that preserves absent/null rather than coercing.
 *
 * Never `Number(...)` for these fields: `Number(null)` is 0, which would render a
 * "min. 0" bracket on a base-priced line, and `Number(undefined)` is NaN.
 */
function parseNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

interface InvoiceItemModelConstructor {
  id: string;
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  taxBase: number;
  tax: number;
  discountType?: DiscountType;
  discount?: number;
  total: number;
  amountBeforeTax: number | null;
  priceSource: PriceSourceType | null;
  appliedTierMinQty: number | null;
  listPrice: number | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class InvoiceItemModel implements AbstractModel {
  public id: string;
  public name: string;
  public description?: string;
  public qty: number;
  public price: number;
  public taxType: TaxType;
  public taxBase: number;
  public tax: number;
  public discountType?: DiscountType;
  public discount?: number;
  public total: number;
  public amountBeforeTax: number | null;
  public priceSource: PriceSourceType | null;
  public appliedTierMinQty: number | null;
  public listPrice: number | null;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: InvoiceItemModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.description = args.description;
    this.qty = args.qty;
    this.price = args.price;
    this.taxType = args.taxType;
    this.taxBase = args.taxBase;
    this.tax = args.tax;
    this.discountType = args.discountType;
    this.discount = args.discount;
    this.total = args.total;
    this.amountBeforeTax = args.amountBeforeTax;
    this.priceSource = args.priceSource;
    this.appliedTierMinQty = args.appliedTierMinQty;
    this.listPrice = args.listPrice;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(data: Record<string, any>): InvoiceItemModel {
    return new InvoiceItemModel({
      id: data.id,
      name: data.name,
      description: data.description,
      qty: data.qty,
      price: data.price,
      taxType: data.tax_type,
      taxBase: data.tax_base,
      tax: data.tax,
      discountType: data.discount_type,
      discount: data.discount,
      total: data.total,
      amountBeforeTax: parseNullableNumber(data.amount_before_tax),
      priceSource: parsePriceSource(data.price_source),
      appliedTierMinQty: parseNullableNumber(data.applied_tier_min_qty),
      listPrice: parseNullableNumber(data.list_price),
      createdAt: DateTime.fromJSDate(data.created_at),
      updatedAt: DateTime.fromJSDate(data.updated_at),
      deletedAt: data.deleted_at ? DateTime.fromJSDate(data.deleted_at) : undefined,
    });
  }

  public toEntity(): InvoiceItemEntity {
    return new InvoiceItemEntity({
      id: this.id,
      name: this.name,
      description: this.description,
      qty: this.qty,
      price: this.price,
      taxType: this.taxType,
      taxBase: this.taxBase,
      tax: this.tax,
      discountType: this.discountType,
      discount: this.discount,
      total: this.total,
      amountBeforeTax: this.amountBeforeTax,
      priceSource: this.priceSource,
      appliedTierMinQty: this.appliedTierMinQty,
      listPrice: this.listPrice,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
