import { DateTime } from "luxon";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import {
  PaymentMethodPayInDetailEntity,
  PaymentMethodPayInDetailRelationship,
} from "@/features/invoice/domain/entities/pay-in-detail/payment-method-pay-in-detail";

type QrisPayInDetailEntityConstructor = {
  id: string;
  status: PayInStatus;
  qrString: string;
  expirationTime: DateTime | null;
  amount: number;
  providerName: string;
  providerId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
  relationship: PaymentMethodPayInDetailRelationship | null;
};

export class QrisPayInDetailEntity extends PaymentMethodPayInDetailEntity {
  public readonly qrString: string;
  public readonly expirationTime: DateTime | null;
  public readonly amount: number;
  public readonly providerName: string;
  public readonly providerId: string;

  constructor(args: QrisPayInDetailEntityConstructor) {
    super({
      id: args.id,
      type: PayInType.QRIS,
      status: args.status,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
      deletedAt: args.deletedAt,
      relationship: args.relationship,
    });
    this.qrString = args.qrString;
    this.expirationTime = args.expirationTime;
    this.amount = args.amount;
    this.providerName = args.providerName;
    this.providerId = args.providerId;
  }
}
