import { AbstractModel } from "@/core/resources/model";
import { PosSalePayInDetailEntity } from "@/features/pos/domain/entities/pos-sale-pay-in-detail";
import { PayInDetailStatus } from "@/features/pos/domain/enums/pay-in-detail-status";
import { PayInMethod } from "@/features/pos/domain/enums/pay-in-method";

type PosSalePayInDetailModelConstructor = {
  id: string;
  referenceType: string;
  paymentMethodId: string;
  method: PayInMethod;
  status: PayInDetailStatus;
  tenderedAmount: number | null;
  changeAmount: number | null;
  qrString: string | null;
  expiresAt: string | null;
};

function parsePayInMethod(raw: unknown): PayInMethod {
  if (typeof raw === "string" && (Object.values(PayInMethod) as string[]).includes(raw)) {
    return raw as PayInMethod;
  }
  return PayInMethod.CASH;
}

function parsePayInDetailStatus(raw: unknown): PayInDetailStatus {
  if (typeof raw === "string" && (Object.values(PayInDetailStatus) as string[]).includes(raw)) {
    return raw as PayInDetailStatus;
  }
  return PayInDetailStatus.PENDING_PAYMENT;
}

export class PosSalePayInDetailModel implements AbstractModel {
  public readonly id: string;
  public readonly referenceType: string;
  public readonly paymentMethodId: string;
  public readonly method: PayInMethod;
  public readonly status: PayInDetailStatus;
  public readonly tenderedAmount: number | null;
  public readonly changeAmount: number | null;
  public readonly qrString: string | null;
  public readonly expiresAt: string | null;

  constructor(args: PosSalePayInDetailModelConstructor) {
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

  public static fromJson(data: Record<string, any>): PosSalePayInDetailModel {
    const rawPaymentMethod = data["payment_method"] ?? {};
    return new PosSalePayInDetailModel({
      id: data["id"] ?? "",
      referenceType: data["reference_type"] ?? "",
      paymentMethodId: rawPaymentMethod["id"] ?? "",
      method: parsePayInMethod(data["method"]),
      status: parsePayInDetailStatus(data["status"]),
      tenderedAmount: typeof data["tendered_amount"] === "number" ? data["tendered_amount"] : null,
      changeAmount: typeof data["change_amount"] === "number" ? data["change_amount"] : null,
      qrString: typeof data["qr_string"] === "string" ? data["qr_string"] : null,
      expiresAt: typeof data["expires_at"] === "string" ? data["expires_at"] : null,
    });
  }

  public toEntity(): PosSalePayInDetailEntity {
    return new PosSalePayInDetailEntity({
      id: this.id,
      referenceType: this.referenceType,
      paymentMethodId: this.paymentMethodId,
      method: this.method,
      status: this.status,
      tenderedAmount: this.tenderedAmount,
      changeAmount: this.changeAmount,
      qrString: this.qrString,
      expiresAt: this.expiresAt,
    });
  }
}
