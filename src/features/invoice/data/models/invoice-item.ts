import { DateTime } from "luxon";
import { InvoiceItemEntity } from "@/features/invoice/domain/entities/invoice-item";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { AbstractModel } from "@/core/resources/model";

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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
