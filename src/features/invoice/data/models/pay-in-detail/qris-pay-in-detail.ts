import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { PaymentMethodPayInDetailRelationship } from "@/features/invoice/domain/entities/pay-in-detail/payment-method-pay-in-detail";
import { QrisPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/qris-pay-in-detail";

type QrisPayInDetailModelConstructor = {
  id: string;
  status: PayInStatus;
  qrString: string;
  expirationTime: DateTime;
  amount: number;
  providerName: string;
  providerId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
  relationship: PaymentMethodPayInDetailRelationship | null;
};

function parseStatus(raw: unknown): PayInStatus {
  if (typeof raw === "string" && (Object.values(PayInStatus) as string[]).includes(raw)) {
    return raw as PayInStatus;
  }
  return PayInStatus.PENDING_PAYMENT;
}

function parseRelationship(doc: Record<string, any>): PaymentMethodPayInDetailRelationship | null {
  const ref = doc["pay_in_detail"];
  if (ref && typeof ref === "object" && typeof ref.id === "string") {
    return { payInDetail: { id: ref.id } };
  }
  return null;
}

export class QrisPayInDetailModel implements AbstractModel {
  public readonly id: string;
  public readonly status: PayInStatus;
  public readonly qrString: string;
  public readonly expirationTime: DateTime;
  public readonly amount: number;
  public readonly providerName: string;
  public readonly providerId: string;
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt: DateTime | null;
  public readonly relationship: PaymentMethodPayInDetailRelationship | null;

  constructor(args: QrisPayInDetailModelConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.qrString = args.qrString;
    this.expirationTime = args.expirationTime;
    this.amount = args.amount;
    this.providerName = args.providerName;
    this.providerId = args.providerId;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
    this.relationship = args.relationship;
  }

  public static fromJson(doc: Record<string, any>): QrisPayInDetailModel {
    return new QrisPayInDetailModel({
      id: doc["id"] ?? "",
      status: parseStatus(doc["status"]),
      qrString: doc["qr_string"] ?? "",
      expirationTime: DateTime.fromISO(doc["expiration_time"] ?? ""),
      amount: typeof doc["amount"] === "number" ? doc["amount"] : 0,
      providerName: doc["provider_name"] ?? "",
      providerId: doc["provider_id"] ?? "",
      createdAt: DateTime.fromISO(doc["created_at"] ?? ""),
      updatedAt: DateTime.fromISO(doc["updated_at"] ?? ""),
      deletedAt: typeof doc["deleted_at"] === "string" ? DateTime.fromISO(doc["deleted_at"]) : null,
      relationship: parseRelationship(doc),
    });
  }

  public toEntity(): QrisPayInDetailEntity {
    return new QrisPayInDetailEntity({
      id: this.id,
      status: this.status,
      qrString: this.qrString,
      expirationTime: this.expirationTime,
      amount: this.amount,
      providerName: this.providerName,
      providerId: this.providerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      relationship: this.relationship,
    });
  }
}
