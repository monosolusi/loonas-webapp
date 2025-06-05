import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { InvoiceSenderEntity } from "@/features/invoice/domain/entities/invoice-sender";

interface InvoiceSenderModelConstructor {
  id: string;
  fullName: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class InvoiceSenderModel implements AbstractModel {
  public id: string;
  public fullName: string;
  public address: string;
  public phoneNumber?: string;
  public email?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: InvoiceSenderModelConstructor) {
    this.id = args.id;
    this.fullName = args.fullName;
    this.address = args.address;
    this.phoneNumber = args.phoneNumber;
    this.email = args.email;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(json: Record<string, any>): InvoiceSenderModel {
    return new InvoiceSenderModel({
      id: json["id"],
      fullName: json["full_name"],
      address: json["address"],
      phoneNumber: json["phone_number"],
      email: json["email"],
      createdAt: DateTime.fromISO(json["created_at"]),
      updatedAt: DateTime.fromISO(json["updated_at"]),
      deletedAt: json["deleted_at"] && DateTime.fromISO(json["deleted_at"]),
    });
  }

  toEntity(): InvoiceSenderEntity {
    return new InvoiceSenderEntity({
      id: this.id,
      fullName: this.fullName,
      address: this.address,
      phoneNumber: this.phoneNumber,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
