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
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { PayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/pay-in-detail";
import { InvoiceFundRecipientModel } from "@/features/invoice/data/models/invoice-fund-recipient";
import { InvoicePaymentConfigurationModel } from "@/features/invoice/data/models/invoice-payment-configuration";

interface OutgoingInvoiceModelConstructor {
  id: string;
  type: InvoiceType;
  channel: InvoiceChannel;
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
  payInDetail: PayInDetailModel | null;
  fundRecipient: InvoiceFundRecipientModel | null;
  paymentConfiguration: InvoicePaymentConfigurationModel[];
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

function parseChannel(raw: unknown): InvoiceChannel {
  if (typeof raw === "string" && (Object.values(InvoiceChannel) as string[]).includes(raw)) {
    return raw as InvoiceChannel;
  }
  return InvoiceChannel.INVOICE;
}

export class OutgoingInvoiceModel implements AbstractModel {
  public id: string;
  public type: InvoiceType;
  public channel: InvoiceChannel;
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
  public payInDetail: PayInDetailModel | null;
  public fundRecipient: InvoiceFundRecipientModel | null;
  public paymentConfiguration: InvoicePaymentConfigurationModel[];
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: OutgoingInvoiceModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.channel = args.channel;
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
    this.payInDetail = args.payInDetail;
    this.fundRecipient = args.fundRecipient;
    this.paymentConfiguration = args.paymentConfiguration;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(data: Record<string, any>, params: OutgoingInvoiceModelFromJsonParams): OutgoingInvoiceModel {
    const rawPayInDetail = data["pay_in_detail"];
    const rawFundRecipient = data["fund_recipient"];
    const rawPaymentConfig = data["payment_configuration"];
    return new OutgoingInvoiceModel({
      id: data.id,
      type: data.type as InvoiceType,
      channel: parseChannel(data.channel),
      recipient: params.recipient,
      invoiceNumber: data.invoice_number ?? "",
      invoiceDate: DateTime.fromISO(data.invoice_date ?? ""),
      dueDate: DateTime.fromISO(data.due_date ?? data.invoice_date ?? ""),
      items: params.items,
      note: data.note ?? undefined,
      tnc: data.tnc ?? undefined,
      signature: params.signature,
      pdf: params.pdf,
      status: data.status as OutgoingInvoiceStatus,
      summary: params.summary,
      sender: params.sender,
      sendChannel: Array.isArray(data.send_channel) ? data.send_channel : [],
      paymentUrl: data.payment_url ?? undefined,
      payInDetail: rawPayInDetail ? PayInDetailModel.fromJson(rawPayInDetail) : null,
      fundRecipient: rawFundRecipient ? InvoiceFundRecipientModel.fromJson(rawFundRecipient) : null,
      paymentConfiguration: Array.isArray(rawPaymentConfig)
        ? rawPaymentConfig.map(InvoicePaymentConfigurationModel.fromJson)
        : [],
      createdAt: DateTime.fromISO(data.created_at ?? ""),
      updatedAt: DateTime.fromISO(data.updated_at ?? ""),
      deletedAt: data.deleted_at ? DateTime.fromISO(data.deleted_at) : undefined,
    });
  }

  public toEntity(): OutgoingInvoiceEntity {
    return new OutgoingInvoiceEntity({
      id: this.id,
      type: this.type,
      channel: this.channel,
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
      payInDetail: this.payInDetail ? this.payInDetail.toEntity() : null,
      fundRecipient: this.fundRecipient ? this.fundRecipient.toEntity() : null,
      paymentConfiguration: this.paymentConfiguration.map((p) => p.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
