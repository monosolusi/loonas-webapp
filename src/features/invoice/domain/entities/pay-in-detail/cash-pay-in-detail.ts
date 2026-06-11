import { DateTime } from "luxon";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import {
  PaymentMethodPayInDetailEntity,
  PaymentMethodPayInDetailRelationship,
} from "@/features/invoice/domain/entities/pay-in-detail/payment-method-pay-in-detail";

type CashPayInDetailEntityConstructor = {
  id: string;
  status: PayInStatus;
  tenderedAmount: number | null;
  changeAmount: number | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
  relationship: PaymentMethodPayInDetailRelationship | null;
};

export class CashPayInDetailEntity extends PaymentMethodPayInDetailEntity {
  public readonly tenderedAmount: number | null;
  public readonly changeAmount: number | null;

  constructor(args: CashPayInDetailEntityConstructor) {
    super({
      id: args.id,
      type: PayInType.CASH,
      status: args.status,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
      deletedAt: args.deletedAt,
      relationship: args.relationship,
    });
    this.tenderedAmount = args.tenderedAmount;
    this.changeAmount = args.changeAmount;
  }
}
