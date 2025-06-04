import { DateTime } from "luxon";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { AbstractEntity } from "@/core/resources/entity";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

interface InvoiceItemEntityConstructor {
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
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class InvoiceItemEntity implements AbstractEntity {
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
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: InvoiceItemEntityConstructor) {
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
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
