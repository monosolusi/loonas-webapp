import { AbstractEntity } from "@/core/resources/entity";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DateTime } from "luxon";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";

interface PublicOutgoingInvoiceEntityConstructor {
  id: string;
  sender: { name: string; address: string };
  recipient: { name: string; email: string; phoneNumber: string };
  summary: { total: number };
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  createdAt: DateTime;
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
  }>;
  status: OutgoingInvoiceStatus;
}

export class PublicOutgoingInvoiceEntity implements AbstractEntity {
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

  constructor(args: PublicOutgoingInvoiceEntityConstructor) {
    this.id = args.id;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.items = args.items;
    this.signature = args.signature;
    this.invoiceNumber = args.invoiceNumber;
    this.invoiceDate = args.invoiceDate;
    this.summary = args.summary;
    this.dueDate = args.dueDate;
    this.createdAt = args.createdAt;
    this.note = args.note;
    this.tnc = args.tnc;
    this.paymentMethods = args.paymentMethods;
    this.status = args.status;
  }
}
