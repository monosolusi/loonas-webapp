import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { CashPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/cash-pay-in-detail";
import { PaymentMethodPayInDetailRelationship } from "@/features/invoice/domain/entities/pay-in-detail/payment-method-pay-in-detail";

type CashPayInDetailModelConstructor = {
  id: string;
  status: PayInStatus;
  tenderedAmount: number | null;
  changeAmount: number | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
  relationship: PaymentMethodPayInDetailRelationship | null;
};

function parseStatus(raw: unknown): PayInStatus {
  if (typeof raw === "string" && (Object.values(PayInStatus) as string[]).includes(raw)) {
    return raw as PayInStatus;
  }
  return PayInStatus.PAID;
}

function parseRelationship(doc: Record<string, any>): PaymentMethodPayInDetailRelationship | null {
  const ref = doc["pay_in_detail"];
  if (ref && typeof ref === "object" && typeof ref.id === "string") {
    return { payInDetail: { id: ref.id } };
  }
  return null;
}

export class CashPayInDetailModel implements AbstractModel {
  public readonly id: string;
  public readonly status: PayInStatus;
  public readonly tenderedAmount: number | null;
  public readonly changeAmount: number | null;
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt: DateTime | null;
  public readonly relationship: PaymentMethodPayInDetailRelationship | null;

  constructor(args: CashPayInDetailModelConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.tenderedAmount = args.tenderedAmount;
    this.changeAmount = args.changeAmount;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
    this.relationship = args.relationship;
  }

  public static fromJson(doc: Record<string, any>): CashPayInDetailModel {
    return new CashPayInDetailModel({
      id: doc["id"] ?? "",
      status: parseStatus(doc["status"]),
      tenderedAmount: typeof doc["tendered_amount"] === "number" ? doc["tendered_amount"] : null,
      changeAmount: typeof doc["change_amount"] === "number" ? doc["change_amount"] : null,
      createdAt: DateTime.fromISO(doc["created_at"] ?? ""),
      updatedAt: DateTime.fromISO(doc["updated_at"] ?? ""),
      deletedAt: typeof doc["deleted_at"] === "string" ? DateTime.fromISO(doc["deleted_at"]) : null,
      relationship: parseRelationship(doc),
    });
  }

  public toEntity(): CashPayInDetailEntity {
    return new CashPayInDetailEntity({
      id: this.id,
      status: this.status,
      tenderedAmount: this.tenderedAmount,
      changeAmount: this.changeAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      relationship: this.relationship,
    });
  }
}
