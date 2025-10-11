import { DateTime } from "luxon";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";

type Relationship = { payInDetail: { id: string } };

type QrisPayInDetailEntityConstructor = {
  id: string;
  status: string;
  qrString: string;
  expirationTime: DateTime;
  amount: number;
  providerName: string;
  providerId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
  relationship: Relationship;
};

export class QrisPayInDetailEntity implements PaymentMethodPayInDetailEntity {
  public id: string;
  public status: string;
  public qrString: string;
  public expirationTime: DateTime;
  public amount: number;
  public providerName: string;
  public providerId: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;
  public relationship: Relationship;

  constructor(args: QrisPayInDetailEntityConstructor) {
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
}
