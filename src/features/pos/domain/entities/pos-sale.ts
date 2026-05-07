import { AbstractEntity } from "@/core/resources/entity";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PosSaleItemEntity } from "@/features/pos/domain/entities/pos-sale-item";
import { PosSalePayInDetailEntity } from "@/features/pos/domain/entities/pos-sale-pay-in-detail";

export type InvoiceChannel = "pos" | "invoice";

type PosSaleEntityConstructor = {
  id: string;
  receiptNumber: string;
  invoiceDate: string;
  channel: InvoiceChannel;
  status: OutgoingInvoiceStatus;
  subtotal: number;
  total: number;
  note: string | null;
  items: PosSaleItemEntity[];
  payInDetail: PosSalePayInDetailEntity | null;
  createdAt: string;
  updatedAt: string;
};

export class PosSaleEntity implements AbstractEntity {
  public readonly id: string;
  public readonly receiptNumber: string;
  public readonly invoiceDate: string;
  public readonly channel: InvoiceChannel;
  public readonly status: OutgoingInvoiceStatus;
  public readonly subtotal: number;
  public readonly total: number;
  public readonly note: string | null;
  public readonly items: PosSaleItemEntity[];
  public readonly payInDetail: PosSalePayInDetailEntity | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PosSaleEntityConstructor) {
    this.id = args.id;
    this.receiptNumber = args.receiptNumber;
    this.invoiceDate = args.invoiceDate;
    this.channel = args.channel;
    this.status = args.status;
    this.subtotal = args.subtotal;
    this.total = args.total;
    this.note = args.note;
    this.items = args.items;
    this.payInDetail = args.payInDetail;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
