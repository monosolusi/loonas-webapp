import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceRecipientEntityConstructor {
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

export class InvoiceRecipientEntity implements AbstractEntity {
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

  constructor(args: InvoiceRecipientEntityConstructor) {
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
}
