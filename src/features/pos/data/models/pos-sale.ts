import { AbstractModel } from "@/core/resources/model";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PosSaleItemModel } from "@/features/pos/data/models/pos-sale-item";
import { PosSalePayInDetailModel } from "@/features/pos/data/models/pos-sale-pay-in-detail";
import { InvoiceChannel, PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";

function parseOutgoingInvoiceStatus(raw: unknown): OutgoingInvoiceStatus {
  if (typeof raw === "string" && (Object.values(OutgoingInvoiceStatus) as string[]).includes(raw)) {
    return raw as OutgoingInvoiceStatus;
  }
  return OutgoingInvoiceStatus.DRAFT;
}

function parseChannel(raw: unknown): InvoiceChannel {
  if (raw === "pos" || raw === "invoice") return raw;
  return "invoice";
}

type PosSaleModelConstructor = {
  id: string;
  receiptNumber: string;
  invoiceDate: string;
  channel: InvoiceChannel;
  status: OutgoingInvoiceStatus;
  subtotal: number;
  total: number;
  note: string | null;
  items: PosSaleItemModel[];
  payInDetail: PosSalePayInDetailModel | null;
  createdAt: string;
  updatedAt: string;
};

export class PosSaleModel implements AbstractModel {
  public readonly id: string;
  public readonly receiptNumber: string;
  public readonly invoiceDate: string;
  public readonly channel: InvoiceChannel;
  public readonly status: OutgoingInvoiceStatus;
  public readonly subtotal: number;
  public readonly total: number;
  public readonly note: string | null;
  public readonly items: PosSaleItemModel[];
  public readonly payInDetail: PosSalePayInDetailModel | null;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PosSaleModelConstructor) {
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

  public static fromJson(data: Record<string, any>): PosSaleModel {
    const rawItems = data["items"];
    const rawPayInDetail = data["pay_in_detail"];
    return new PosSaleModel({
      id: data["id"] ?? "",
      receiptNumber: data["receipt_number"] ?? "",
      invoiceDate: data["invoice_date"] ?? "",
      channel: parseChannel(data["channel"]),
      status: parseOutgoingInvoiceStatus(data["status"]),
      subtotal: data["subtotal"] ?? 0,
      total: data["total"] ?? 0,
      note: data["note"] ?? null,
      items: Array.isArray(rawItems) ? rawItems.map(PosSaleItemModel.fromJson) : [],
      payInDetail: rawPayInDetail ? PosSalePayInDetailModel.fromJson(rawPayInDetail) : null,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): PosSaleEntity {
    return new PosSaleEntity({
      id: this.id,
      receiptNumber: this.receiptNumber,
      invoiceDate: this.invoiceDate,
      channel: this.channel,
      status: this.status,
      subtotal: this.subtotal,
      total: this.total,
      note: this.note,
      items: this.items.map((i) => i.toEntity()),
      payInDetail: this.payInDetail ? this.payInDetail.toEntity() : null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
