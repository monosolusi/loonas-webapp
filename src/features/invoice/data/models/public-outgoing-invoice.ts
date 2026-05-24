import { AbstractModel } from "@/core/resources/model";
import { DateTime } from "luxon";
import { PublicOutgoingInvoiceEntity } from "@/features/invoice/domain/entities/public-outgoing-invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";

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
  note?: string;
  tnc?: string;
  paymentMethods: Array<{
    id: string;
    isActive: boolean;
    title: string;
    requiresSchemeSelection: boolean;
    schemes: Array<{ id: string; imageUrl: string; name: string }>;
    limit: { min: number; max: number };
    pricing: { base: number; percentage: number };
    chargeFeeOn: ChargeFeeOn;
  }>;
  status: OutgoingInvoiceStatus;
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
  public note?: string;
  public tnc?: string;
  public paymentMethods: Array<{
    id: string;
    isActive: boolean;
    title: string;
    requiresSchemeSelection: boolean;
    schemes: Array<{ id: string; imageUrl: string; name: string }>;
    limit: { min: number; max: number };
    pricing: { base: number; percentage: number };
  }>;
  public status: OutgoingInvoiceStatus;

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
    this.note = args.note;
    this.tnc = args.tnc;
    this.paymentMethods = args.paymentMethods;
    this.status = args.status;
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
      note: json.note,
      tnc: json.tnc,
      paymentMethods: json.payment_methods.map((method: any) => ({
        id: method.id,
        isActive: method.is_active,
        title: method.title,
        requiresSchemeSelection: method.requires_scheme_selection,
        schemes: method.schemes.map((scheme: any) => ({
          id: scheme.id,
          imageUrl: scheme.logo_url,
          name: scheme.name,
        })),
        limit: { min: method.limit.min, max: method.limit.max },
        pricing: { base: method.pricing.base, percentage: method.pricing.percentage },
        chargeFeeOn: method.charge_fee_on as ChargeFeeOn,
      })),
      status: json.status as OutgoingInvoiceStatus,
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
      note: this.note,
      tnc: this.tnc,
      paymentMethods: this.paymentMethods,
      status: this.status,
    });
  }
}
