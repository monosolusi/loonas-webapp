import { AbstractEntity } from "@/core/resources/entity";
import { PayInDetailStatus } from "@/features/pos/domain/enums/pay-in-detail-status";
import { PayInMethod } from "@/features/pos/domain/enums/pay-in-method";

type PosSalePayInDetailEntityConstructor = {
  id: string;
  referenceType: string;
  paymentMethodId: string;
  method: PayInMethod;
  status: PayInDetailStatus;
  // CASH branch only
  tenderedAmount: number | null;
  changeAmount: number | null;
  // QRIS branch only
  qrString: string | null;
  expiresAt: string | null;
};

export class PosSalePayInDetailEntity implements AbstractEntity {
  public readonly id: string;
  public readonly referenceType: string;
  public readonly paymentMethodId: string;
  public readonly method: PayInMethod;
  public readonly status: PayInDetailStatus;
  public readonly tenderedAmount: number | null;
  public readonly changeAmount: number | null;
  public readonly qrString: string | null;
  public readonly expiresAt: string | null;

  constructor(args: PosSalePayInDetailEntityConstructor) {
    this.id = args.id;
    this.referenceType = args.referenceType;
    this.paymentMethodId = args.paymentMethodId;
    this.method = args.method;
    this.status = args.status;
    this.tenderedAmount = args.tenderedAmount;
    this.changeAmount = args.changeAmount;
    this.qrString = args.qrString;
    this.expiresAt = args.expiresAt;
  }

  public isCash(): boolean {
    return this.method === PayInMethod.CASH;
  }

  public isQris(): boolean {
    return this.method === PayInMethod.QRIS;
  }
}
