import { DateTime } from "luxon";
import { PayInReferenceType } from "../../domain/enums/pay-in-reference-type";
import { AbstractModel } from "@/core/resources/model";
import { PayInEntity } from "../../domain/entities/pay-in";

interface PayInModelConstructor {
  id: string;
  referenceType: PayInReferenceType;
  referenceId: string;
  paymentMethodId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PayInModel implements AbstractModel {
  public id: string;
  public referenceType: PayInReferenceType;
  public referenceId: string;
  public paymentMethodId: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: PayInModelConstructor) {
    this.id = args.id;
    this.referenceType = args.referenceType;
    this.referenceId = args.referenceId;
    this.paymentMethodId = args.paymentMethodId;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): PayInModel {
    return new PayInModel({
      id: doc.id,
      referenceType: doc.reference_type,
      referenceId: doc.reference_id,
      paymentMethodId: doc.payment_method_id,
      createdAt: DateTime.fromISO(doc.created_at),
      updatedAt: DateTime.fromISO(doc.updated_at),
      deletedAt: doc.deleted_at ? DateTime.fromISO(doc.deleted_at) : undefined,
    });
  }

  toEntity(): PayInEntity {
    return new PayInEntity({
      id: this.id,
      referenceType: this.referenceType,
      referenceId: this.referenceId,
      paymentMethodId: this.paymentMethodId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
