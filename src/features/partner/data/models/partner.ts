import { AbstractModel } from "@/core/resources/model";
import { PartnerEntity } from "../../domain/entities/partner";
import { DateTime } from "luxon";

interface PartnerModelConstructor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PartnerModel implements AbstractModel {
  public id: string;
  public name: string;
  public email: string;
  public phoneNumber: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: PartnerModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.email = args.email;
    this.phoneNumber = args.phoneNumber;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): PartnerModel {
    return new PartnerModel({
      id: doc["id"],
      name: doc["name"],
      email: doc["email"],
      phoneNumber: doc["phone"],
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined
    });
  }

  toEntity(): PartnerEntity {
    return new PartnerEntity(
      this.id,
      this.name,
      this.email,
      this.phoneNumber,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    );
  }
}