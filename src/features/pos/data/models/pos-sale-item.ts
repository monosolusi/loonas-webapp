import { AbstractModel } from "@/core/resources/model";
import { VariantModel } from "@/features/product/data/models/variant";
import { PosSaleItemEntity } from "@/features/pos/domain/entities/pos-sale-item";

type PosSaleItemModelConstructor = {
  id: string;
  name: string;
  description: string | null;
  qty: number;
  price: number;
  amountBeforeTax: number;
  taxType: string;
  taxBase: number;
  tax: number;
  discountType: string;
  discount: number | null;
  total: number;
  variant: VariantModel | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export class PosSaleItemModel implements AbstractModel {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly qty: number;
  public readonly price: number;
  public readonly amountBeforeTax: number;
  public readonly taxType: string;
  public readonly taxBase: number;
  public readonly tax: number;
  public readonly discountType: string;
  public readonly discount: number | null;
  public readonly total: number;
  public readonly variant: VariantModel | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly deletedAt: string | null;

  constructor(args: PosSaleItemModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.description = args.description;
    this.qty = args.qty;
    this.price = args.price;
    this.amountBeforeTax = args.amountBeforeTax;
    this.taxType = args.taxType;
    this.taxBase = args.taxBase;
    this.tax = args.tax;
    this.discountType = args.discountType;
    this.discount = args.discount;
    this.total = args.total;
    this.variant = args.variant;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(data: Record<string, any>): PosSaleItemModel {
    return new PosSaleItemModel({
      id: data["id"] ?? "",
      name: data["name"] ?? "",
      description: data["description"] ?? null,
      qty: data["qty"] ?? 0,
      price: data["price"] ?? 0,
      amountBeforeTax: data["amount_before_tax"] ?? 0,
      taxType: data["tax_type"] ?? "NON_TAXABLE",
      taxBase: data["tax_base"] ?? 0,
      tax: data["tax"] ?? 0,
      discountType: data["discount_type"] ?? "NO_DISCOUNT",
      discount: data["discount"] ?? null,
      total: data["total"] ?? 0,
      variant: data["variant"] ? VariantModel.fromJson(data["variant"]) : null,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
      deletedAt: data["deleted_at"] ?? null,
    });
  }

  public toEntity(): PosSaleItemEntity {
    return new PosSaleItemEntity({
      id: this.id,
      name: this.name,
      description: this.description,
      qty: this.qty,
      price: this.price,
      amountBeforeTax: this.amountBeforeTax,
      taxType: this.taxType,
      taxBase: this.taxBase,
      tax: this.tax,
      discountType: this.discountType,
      discount: this.discount,
      total: this.total,
      variant: this.variant?.toEntity() ?? null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
