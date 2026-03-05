import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { FileModel } from "@/features/file/data/models/file";
import { InvoiceItemModel } from "@/features/invoice/data/models/invoice-item";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceItemSummaryModel } from "@/features/invoice/data/models/invoice-item-summary";
import { InvoiceSenderModel } from "@/features/invoice/data/models/invoice-sender";
import { InvoiceRecipientModel } from "@/features/invoice/data/models/invoice-recipient";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

interface OutgoingInvoiceModelConstructor {
  id: string;
  type: InvoiceType;
  recipient: InvoiceRecipientModel;
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItemModel[];
  note?: string;
  tnc?: string;
  signature?: FileModel;
  pdf?: FileModel;
  status: OutgoingInvoiceStatus;
  summary: InvoiceItemSummaryModel;
  sender: InvoiceSenderModel;
  sendChannel: NotificationChannel[];
  paymentUrl?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

interface OutgoingInvoiceModelFromJsonParams {
  recipient: InvoiceRecipientModel;
  items: InvoiceItemModel[];
  signature?: FileModel;
  pdf?: FileModel;
  summary: InvoiceItemSummaryModel;
  sender: InvoiceSenderModel;
}

export class OutgoingInvoiceModel implements AbstractModel {
  public id: string;
  public type: InvoiceType;
  public recipient: InvoiceRecipientModel;
  public invoiceNumber: string;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public items: InvoiceItemModel[];
  public note?: string;
  public tnc?: string;
  public signature?: FileModel;
  public pdf?: FileModel;
  public status: OutgoingInvoiceStatus;
  public summary: InvoiceItemSummaryModel;
  public sender: InvoiceSenderModel;
  public sendChannel: NotificationChannel[];
  public paymentUrl?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: OutgoingInvoiceModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.recipient = args.recipient;
    this.invoiceNumber = args.invoiceNumber;
    this.invoiceDate = args.invoiceDate;
    this.dueDate = args.dueDate;
    this.items = args.items;
    this.note = args.note;
    this.tnc = args.tnc;
    this.signature = args.signature;
    this.pdf = args.pdf;
    this.status = args.status;
    this.summary = args.summary;
    this.sender = args.sender;
    this.sendChannel = args.sendChannel;
    this.paymentUrl = args.paymentUrl;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(data: Record<string, any>, params: OutgoingInvoiceModelFromJsonParams): OutgoingInvoiceModel {
    return new OutgoingInvoiceModel({
      id: data.id,
      type: data.type as InvoiceType,
      recipient: params.recipient,
      invoiceNumber: data.invoice_number,
      invoiceDate: DateTime.fromISO(data.invoice_date),
      dueDate: DateTime.fromISO(data.due_date),
      items: params.items,
      note: data.note,
      tnc: data.tnc,
      signature: params.signature,
      pdf: params.pdf,
      status: data.status as OutgoingInvoiceStatus,
      summary: params.summary,
      sender: params.sender,
      sendChannel: data.send_channel,
      paymentUrl: data.payment_url,
      createdAt: DateTime.fromISO(data.created_at),
      updatedAt: DateTime.fromISO(data.updated_at),
      deletedAt: data.deleted_at ? DateTime.fromISO(data.deleted_at) : undefined,
    });
  }

  public toEntity(): OutgoingInvoiceEntity {
    return new OutgoingInvoiceEntity({
      id: this.id,
      type: this.type,
      recipient: this.recipient.toEntity(),
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate,
      dueDate: this.dueDate,
      items: this.items.map((item) => item.toEntity()),
      note: this.note,
      tnc: this.tnc,
      signature: this.signature?.toEntity(),
      pdf: this.pdf?.toEntity(),
      status: this.status,
      summary: this.summary.toEntity(),
      sender: this.sender.toEntity(),
      sendChannel: this.sendChannel,
      paymentUrl: this.paymentUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
