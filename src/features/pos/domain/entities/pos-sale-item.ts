import { AbstractEntity } from "@/core/resources/entity";
import { VariantEntity } from "@/features/product/domain/entities/variant";

type PosSaleItemEntityConstructor = {
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
  variant: VariantEntity | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export class PosSaleItemEntity implements AbstractEntity {
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
  public readonly variant: VariantEntity | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly deletedAt: string | null;

  constructor(args: PosSaleItemEntityConstructor) {
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
}
