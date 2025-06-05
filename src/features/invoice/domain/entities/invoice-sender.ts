import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceSenderEntityConstructor {
  id: string;
  fullName: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class InvoiceSenderEntity implements AbstractEntity {
  public id: string;
  public fullName: string;
  public address: string;
  public phoneNumber?: string;
  public email?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: InvoiceSenderEntityConstructor) {
    this.id = args.id;
    this.fullName = args.fullName;
    this.address = args.address;
    this.phoneNumber = args.phoneNumber;
    this.email = args.email;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
