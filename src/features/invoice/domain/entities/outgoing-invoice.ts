import { DateTime } from "luxon";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { FileEntity } from "@/features/file/domain/entities/file";
import { AbstractEntity } from "@/core/resources/entity";
import { InvoiceItemEntity } from "@/features/invoice/domain/entities/invoice-item";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceItemSummaryEntity } from "@/features/invoice/domain/entities/invoice-item-summary";

interface OutgoingInvoiceEntityConstructor {
  id: string;
  recipient: PartnerEntity;
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItemEntity[];
  note?: string;
  tnc?: string;
  signature?: FileEntity;
  status: OutgoingInvoiceStatus;
  summary: InvoiceItemSummaryEntity;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class OutgoingInvoiceEntity implements AbstractEntity {
  public id: string;
  public recipient: PartnerEntity;
  public invoiceNumber: string;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public items: InvoiceItemEntity[];
  public note?: string;
  public tnc?: string;
  public signature?: FileEntity;
  public status: OutgoingInvoiceStatus;
  public summary: InvoiceItemSummaryEntity;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: OutgoingInvoiceEntityConstructor) {
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
}
