import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface BusinessAccountEntityConstructor {
  id: string;
  company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: { id: string };
      city: { id: string };
      district: { id: string };
      subdistrict: { id: string };
      address: string;
    };
  };
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class BusinessAccountEntity implements AbstractEntity {
  public id: string;
  public company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: { id: string };
      city: { id: string };
      district: { id: string };
      subdistrict: { id: string };
      address: string;
    };
  };
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: BusinessAccountEntityConstructor) {
    this.id = args.id;
    this.company = args.company;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
