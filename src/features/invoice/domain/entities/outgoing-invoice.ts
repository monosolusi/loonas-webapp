import { DateTime } from "luxon";
import { FileEntity } from "@/features/file/domain/entities/file";
import { AbstractEntity } from "@/core/resources/entity";
import { InvoiceItemEntity } from "@/features/invoice/domain/entities/invoice-item";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceItemSummaryEntity } from "@/features/invoice/domain/entities/invoice-item-summary";
import { InvoiceSenderEntity } from "@/features/invoice/domain/entities/invoice-sender";
import { InvoiceRecipientEntity } from "@/features/invoice/domain/entities/invoice-recipient";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { PayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/pay-in-detail";
import { InvoiceFundRecipientEntity } from "@/features/invoice/domain/entities/invoice-fund-recipient";
import { InvoicePaymentConfigurationEntity } from "@/features/invoice/domain/entities/invoice-payment-configuration";

interface OutgoingInvoiceEntityConstructor {
  id: string;
  type: InvoiceType;
  channel: InvoiceChannel;
  recipient: InvoiceRecipientEntity;
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItemEntity[];
  note?: string;
  tnc?: string;
  signature?: FileEntity;
  pdf?: FileEntity;
  status: OutgoingInvoiceStatus;
  summary: InvoiceItemSummaryEntity;
  sender: InvoiceSenderEntity;
  sendChannel: NotificationChannel[];
  paymentUrl?: string;
  payInDetail: PayInDetailEntity | null;
  fundRecipient: InvoiceFundRecipientEntity | null;
  paymentConfiguration: InvoicePaymentConfigurationEntity[];
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class OutgoingInvoiceEntity implements AbstractEntity {
  public id: string;
  public type: InvoiceType;
  public channel: InvoiceChannel;
  public recipient: InvoiceRecipientEntity;
  public invoiceNumber: string;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public items: InvoiceItemEntity[];
  public note?: string;
  public tnc?: string;
  public signature?: FileEntity;
  public pdf?: FileEntity;
  public status: OutgoingInvoiceStatus;
  public summary: InvoiceItemSummaryEntity;
  public sender: InvoiceSenderEntity;
  public sendChannel: NotificationChannel[];
  public paymentUrl?: string;
  public payInDetail: PayInDetailEntity | null;
  public fundRecipient: InvoiceFundRecipientEntity | null;
  public paymentConfiguration: InvoicePaymentConfigurationEntity[];
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: OutgoingInvoiceEntityConstructor) {
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
}
