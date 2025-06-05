import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PartnerModel } from "@/features/partner/data/models/partner";
import { FileModel } from "@/features/file/data/models/file";
import { InvoiceItemModel } from "@/features/invoice/data/models/invoice-item";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceItemSummaryModel } from "@/features/invoice/data/models/invoice-item-summary";

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
  status: OutgoingInvoiceStatus;
  summary: InvoiceItemSummaryModel;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

interface OutgoingInvoiceModelFromJsonParams {
  recipient: PartnerModel;
  items: InvoiceItemModel[];
  signature?: FileModel;
  summary: InvoiceItemSummaryModel;
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
  public status: OutgoingInvoiceStatus;
  public summary: InvoiceItemSummaryModel;
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
    this.status = args.status;
    this.summary = args.summary;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(data: Record<string, any>, params: OutgoingInvoiceModelFromJsonParams): OutgoingInvoiceModel {
    return new OutgoingInvoiceModel({
      id: data.id,
      recipient: params.recipient,
      invoiceNumber: data.invoice_number,
      invoiceDate: DateTime.fromISO(data.invoice_date),
      dueDate: DateTime.fromISO(data.due_date),
      items: params.items,
      note: data.note,
      tnc: data.tnc,
      signature: params.signature,
      status: data.status as OutgoingInvoiceStatus,
      summary: params.summary,
      createdAt: DateTime.fromISO(data.created_at),
      updatedAt: DateTime.fromISO(data.updated_at),
      deletedAt: data.deleted_at ? DateTime.fromISO(data.deleted_at) : undefined,
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
      status: this.status,
      summary: this.summary.toEntity(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
