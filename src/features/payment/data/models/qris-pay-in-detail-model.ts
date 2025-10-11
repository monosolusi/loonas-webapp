import { DateTime } from "luxon";
import { QrisPayInDetailEntity } from "@/features/payment/domain/entities/qris-pay-in-detail-entity";

type Relationship = { payInDetail: { id: string } };

type QrisPayInDetailModelConstructor = {
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

export class QrisPayInDetailModel {
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
      id: doc.id,
      status: doc.status,
      qrString: doc.qr_string,
      expirationTime: DateTime.fromISO(doc.expiration_time),
      amount: doc.amount,
      providerName: doc.provider_name,
      providerId: doc.provider_id,
      createdAt: DateTime.fromISO(doc.created_at),
      updatedAt: DateTime.fromISO(doc.updated_at),
      deletedAt: doc.deleted_at ? DateTime.fromISO(doc.deleted_at) : undefined,
      relationship: {
        payInDetail: {
          id: doc.pay_in_detail.id,
        },
      },
    });
  }

  toEntity(): QrisPayInDetailEntity {
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
      relationship: this.relationship,
    });
  }
}
