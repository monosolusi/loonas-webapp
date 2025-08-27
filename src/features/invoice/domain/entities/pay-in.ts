import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";
import { PayInReferenceType } from "../enums/pay-in-reference-type";

interface PayInEntityConstructor {
  id: string;
  referenceType: PayInReferenceType;
  referenceId: string;
  paymentMethodId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PayInEntity implements AbstractEntity {
  public id: string;
  public referenceType: PayInReferenceType;
  public referenceId: string;
  public paymentMethodId: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: PayInEntityConstructor) {
    this.id = args.id;
    this.referenceType = args.referenceType;
    this.referenceId = args.referenceId;
    this.paymentMethodId = args.paymentMethodId;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
