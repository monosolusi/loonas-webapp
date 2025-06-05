import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { InvoiceRecipientEntity } from "@/features/invoice/domain/entities/invoice-recipient";

interface InvoiceRecipientModelConstructor {
  id: string;
  nationality?: string;
  fullName: string;
  occupation?: string;
  province?: string;
  city?: string;
  subdistrict?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class InvoiceRecipientModel implements AbstractModel {
  public id: string;
  public nationality?: string;
  public fullName: string;
  public occupation?: string;
  public province?: string;
  public city?: string;
  public subdistrict?: string;
  public address?: string;
  public phoneNumber?: string;
  public email?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: InvoiceRecipientModelConstructor) {
    this.id = args.id;
    this.nationality = args.nationality;
    this.fullName = args.fullName;
    this.occupation = args.occupation;
    this.province = args.province;
    this.city = args.city;
    this.subdistrict = args.subdistrict;
    this.address = args.address;
    this.phoneNumber = args.phoneNumber;
    this.email = args.email;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(json: Record<string, any>): InvoiceRecipientModel {
    return new InvoiceRecipientModel({
      id: json.id,
      nationality: json.nationality,
      fullName: json.full_name,
      occupation: json.occupation,
      province: json.province,
      city: json.city,
      subdistrict: json.subdistrict,
      address: json.address,
      phoneNumber: json.phone_number,
      email: json.email,
      createdAt: DateTime.fromISO(json.created_at),
      updatedAt: DateTime.fromISO(json.updated_at),
      deletedAt: json.deleted_at ? DateTime.fromISO(json.deleted_at) : undefined,
    });
  }

  public toEntity(): InvoiceRecipientEntity {
    return new InvoiceRecipientEntity({
      id: this.id,
      nationality: this.nationality,
      fullName: this.fullName,
      occupation: this.occupation,
      province: this.province,
      city: this.city,
      subdistrict: this.subdistrict,
      address: this.address,
      phoneNumber: this.phoneNumber,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
