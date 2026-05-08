import { AbstractModel } from "@/core/resources/model";
import { PayInReferenceType } from "@/features/invoice/domain/enums/pay-in-reference-type";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { PayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/pay-in-detail";
import { PaymentMethodPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/payment-method-pay-in-detail";
import { QrisPayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/qris-pay-in-detail";
import { CashPayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/cash-pay-in-detail";

type PayInDetailDetailModel = QrisPayInDetailModel | CashPayInDetailModel;

type PayInDetailModelConstructor = {
  id: string;
  referenceType: PayInReferenceType;
  paymentMethodId: string;
  detail: PayInDetailDetailModel | null;
};

function parseReferenceType(raw: unknown): PayInReferenceType {
  if (typeof raw === "string" && (Object.values(PayInReferenceType) as string[]).includes(raw)) {
    return raw as PayInReferenceType;
  }
  return PayInReferenceType.OUTGOING_INVOICE;
}

function parseDetail(raw: unknown): PayInDetailDetailModel | null {
  if (!raw || typeof raw !== "object") return null;
  const doc = raw as Record<string, any>;
  switch (doc["type"]) {
    case PayInType.QRIS:
      return QrisPayInDetailModel.fromJson(doc);
    case PayInType.CASH:
      return CashPayInDetailModel.fromJson(doc);
    default:
      return null;
  }
}

export class PayInDetailModel implements AbstractModel {
  public readonly id: string;
  public readonly referenceType: PayInReferenceType;
  public readonly paymentMethodId: string;
  public readonly detail: PayInDetailDetailModel | null;

  constructor(args: PayInDetailModelConstructor) {
    this.id = args.id;
    this.referenceType = args.referenceType;
    this.paymentMethodId = args.paymentMethodId;
    this.detail = args.detail;
  }

  public static fromJson(doc: Record<string, any>): PayInDetailModel {
    const paymentMethod = doc["payment_method"] ?? {};
    return new PayInDetailModel({
      id: doc["id"] ?? "",
      referenceType: parseReferenceType(doc["reference_type"]),
      paymentMethodId: paymentMethod["id"] ?? "",
      detail: parseDetail(doc["detail"]),
    });
  }

  public toEntity(): PayInDetailEntity {
    const detailEntity: PaymentMethodPayInDetailEntity | null = this.detail ? this.detail.toEntity() : null;
    return new PayInDetailEntity({
      id: this.id,
      referenceType: this.referenceType,
      paymentMethodId: this.paymentMethodId,
      detail: detailEntity,
    });
  }
}
