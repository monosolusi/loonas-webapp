import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PartnerModel } from "@/features/partner/data/models/partner";
import { FileModel } from "@/features/file/data/models/file";
import { InvoiceItemModel } from "@/features/invoice/data/models/invoice-item";

interface OutgoingInvoiceModelConstructor {
  id: string;
  recipient: PartnerModel;
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItemModel[];
  note?: string;
  tnc?: string;
  signature?: FileModel;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

interface OutgoingInvoiceModelFromJsonParams {
  recipient: PartnerModel;
  items: InvoiceItemModel[];
  signature?: FileModel;
}

export class OutgoingInvoiceModel implements AbstractModel {
  public id: string;
  public recipient: PartnerModel;
  public invoiceNumber: string;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public items: InvoiceItemModel[];
  public note?: string;
  public tnc?: string;
  public signature?: FileModel;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: OutgoingInvoiceModelConstructor) {
    this.id = args.id;
    this.recipient = args.recipient;
    this.invoiceNumber = args.invoiceNumber;
    this.invoiceDate = args.invoiceDate;
    this.dueDate = args.dueDate;
    this.items = args.items;
    this.note = args.note;
    this.tnc = args.tnc;
    this.signature = args.signature;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(data: Record<string, any>, params: OutgoingInvoiceModelFromJsonParams): OutgoingInvoiceModel {
    return new OutgoingInvoiceModel({
      id: data.id,
      recipient: params.recipient,
      invoiceNumber: data.invoice_number,
      invoiceDate: DateTime.fromJSDate(data.invoice_date),
      dueDate: DateTime.fromJSDate(data.due_date),
      items: params.items,
      note: data.note,
      tnc: data.tnc,
      signature: params.signature,
      createdAt: DateTime.fromJSDate(data.created_at),
      updatedAt: DateTime.fromJSDate(data.updated_at),
      deletedAt: data.deleted_at ? DateTime.fromJSDate(data.deleted_at) : undefined,
    });
  }

  public toEntity(): OutgoingInvoiceEntity {
    return new OutgoingInvoiceEntity({
      id: this.id,
      recipient: this.recipient.toEntity(),
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate,
      dueDate: this.dueDate,
      items: this.items.map((item) => item.toEntity()),
      note: this.note,
      tnc: this.tnc,
      signature: this.signature?.toEntity(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
