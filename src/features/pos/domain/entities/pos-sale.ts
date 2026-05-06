import { AbstractEntity } from "@/core/resources/entity";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PosSaleItemEntity } from "@/features/pos/domain/entities/pos-sale-item";

type PosSaleEntityConstructor = {
  id: string;
  receiptNumber: string;
  invoiceDate: string;
  paymentGateway: PaymentGatewayEntity;
  status: string;
  subtotal: number;
  total: number;
  note: string | null;
  items: PosSaleItemEntity[];
  createdAt: string;
  updatedAt: string;
};

export class PosSaleEntity implements AbstractEntity {
  public readonly id: string;
  public readonly receiptNumber: string;
  public readonly invoiceDate: string;
  public readonly paymentGateway: PaymentGatewayEntity;
  public readonly status: string;
  public readonly subtotal: number;
  public readonly total: number;
  public readonly note: string | null;
  public readonly items: PosSaleItemEntity[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: PosSaleEntityConstructor) {
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
}
