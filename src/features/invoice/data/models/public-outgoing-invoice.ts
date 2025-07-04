import { AbstractModel } from "@/core/resources/model";
import { DateTime } from "luxon";
import { PublicOutgoingInvoiceEntity } from "../../domain/entities/public-outgoing-invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "../../domain/enums/discount-type";

interface PublicOutgoingInvoiceModelConstructor {
  id: string;
  sender: { name: string; address: string };
  recipient: { name: string; email: string; phoneNumber: string };
  summary: { total: number };
  invoiceNumber: string;
  invoiceDate: DateTime;
  items: Array<{
    name: string;
    description?: string;
    qty: number;
    price: number;
    taxType: TaxType;
    tax: number;
    taxBase: number;
    total: number;
    discountType: DiscountType;
    discount: number;
  }>;
  signature: {
    signerName: string;
    url?: string;
  };
  dueDate: DateTime;
  createdAt: DateTime;
}

export class PublicOutgoingInvoiceModel implements AbstractModel {
  public id: string;
  public sender: { name: string; address: string };
  public recipient: { name: string; email: string; phoneNumber: string };
  public summary: { total: number };
  public invoiceNumber: string;
  public invoiceDate: DateTime;
  public items: Array<{
    name: string;
    description?: string;
    qty: number;
    price: number;
    taxType: TaxType;
    tax: number;
    taxBase: number;
    total: number;
    discountType: DiscountType;
    discount: number;
  }>;
  public signature: {
    signerName: string;
    url?: string;
  };
  public dueDate: DateTime;
  public createdAt: DateTime;

  constructor(args: PublicOutgoingInvoiceModelConstructor) {
    this.id = args.id;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.invoiceNumber = args.invoiceNumber;
    this.invoiceDate = args.invoiceDate;
    this.items = args.items;
    this.signature = args.signature;
    this.summary = args.summary;
    this.dueDate = args.dueDate;
    this.createdAt = args.createdAt;
  }

  public static fromJson(json: Record<string, any>): PublicOutgoingInvoiceModel {
    return new PublicOutgoingInvoiceModel({
      id: json.id,
      sender: {
        name: json.sender.name,
        address: json.sender.address,
      },
      recipient: {
        name: json.recipient.name,
        email: json.recipient.email,
        phoneNumber: json.recipient.phone_number,
      },
      invoiceNumber: json.invoice_number,
      invoiceDate: DateTime.fromISO(json.invoice_date),
      items: json.items.map((item: any) => ({
        name: item.name,
        description: item.description,
        qty: item.qty,
        price: item.price,
        taxType: item.tax_type as TaxType,
        tax: item.tax,
        taxBase: item.tax_base,
        total: item.total,
        discountType: item.discount_type ? (item.discount_type as DiscountType) : undefined,
        discount: item.discount,
      })),
      signature: {
        signerName: json.signature.signer_name,
        url: json.signature.url,
      },
      summary: { total: json.summary.total },
      dueDate: DateTime.fromISO(json.due_date),
      createdAt: DateTime.fromISO(json.created_at),
    });
  }

  public toEntity(): PublicOutgoingInvoiceEntity {
    return new PublicOutgoingInvoiceEntity({
      id: this.id,
      sender: this.sender,
      recipient: this.recipient,
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate,
      items: this.items,
      signature: this.signature,
      summary: this.summary,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
    });
  }
}
