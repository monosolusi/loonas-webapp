import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";

export type PaymentMethodPayInDetailRelationship = { payInDetail: { id: string } };

type PaymentMethodPayInDetailEntityConstructor = {
  id: string;
  type: PayInType;
  status: PayInStatus;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;
  relationship: PaymentMethodPayInDetailRelationship | null;
};

export abstract class PaymentMethodPayInDetailEntity implements AbstractEntity {
  public readonly id: string;
  public readonly type: PayInType;
  public readonly status: PayInStatus;
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt: DateTime | null;
  public readonly relationship: PaymentMethodPayInDetailRelationship | null;

  protected constructor(args: PaymentMethodPayInDetailEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.status = args.status;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
    this.relationship = args.relationship;
  }
}
