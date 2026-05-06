import { AbstractModel } from "@/core/resources/model";
import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { PosSaleItemModel } from "@/features/pos/data/models/pos-sale-item";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";

type PosSaleModelConstructor = {
  id: string;
  receiptNumber: string;
  invoiceDate: string;
  paymentGateway: PaymentGatewayModel;
  status: string;
  subtotal: number;
  total: number;
  note: string | null;
  items: PosSaleItemModel[];
  createdAt: string;
  updatedAt: string;
};

export class PosSaleModel implements AbstractModel {
  public readonly id: string;
  public readonly receiptNumber: string;
  public readonly invoiceDate: string;
  public readonly paymentGateway: PaymentGatewayModel;
  public readonly status: string;
  public readonly subtotal: number;
  public readonly total: number;
  public readonly note: string | null;
  public readonly items: PosSaleItemModel[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PosSaleModelConstructor) {
    this.id = args.id;
    this.receiptNumber = args.receiptNumber;
    this.invoiceDate = args.invoiceDate;
    this.paymentGateway = args.paymentGateway;
    this.status = args.status;
    this.subtotal = args.subtotal;
    this.total = args.total;
    this.note = args.note;
    this.items = args.items;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): PosSaleModel {
    const rawItems = data["items"];
    return new PosSaleModel({
      id: data["id"] ?? "",
      receiptNumber: data["receipt_number"] ?? "",
      invoiceDate: data["invoice_date"] ?? "",
      paymentGateway: PaymentGatewayModel.fromJson(data["payment_gateway"] ?? {}),
      status: data["status"] ?? "",
      subtotal: data["subtotal"] ?? 0,
      total: data["total"] ?? 0,
      note: data["note"] ?? null,
      items: Array.isArray(rawItems) ? rawItems.map(PosSaleItemModel.fromJson) : [],
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): PosSaleEntity {
    return new PosSaleEntity({
      id: this.id,
      receiptNumber: this.receiptNumber,
      invoiceDate: this.invoiceDate,
      paymentGateway: this.paymentGateway.toEntity(),
      status: this.status,
      subtotal: this.subtotal,
      total: this.total,
      note: this.note,
      items: this.items.map((i) => i.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
