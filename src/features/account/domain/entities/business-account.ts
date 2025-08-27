import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";
import { AccountType } from "@/features/account/domain/enums/account-type";

interface BusinessAccountEntityConstructor {
  id: string;
  type: AccountType;
  company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: { id: string; label: string };
      city: { id: string; label: string };
      district: { id: string; label: string };
      subdistrict: { id: string; label: string };
      address: string;
    };
  };
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class BusinessAccountEntity implements AbstractEntity {
  public id: string;
  public type: AccountType;
  public company: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      province: { id: string; label: string };
      city: { id: string; label: string };
      district: { id: string; label: string };
      subdistrict: { id: string; label: string };
      address: string;
    };
  };
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: BusinessAccountEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.company = args.company;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public get fullAddress() {
    return `${this.company.address.address}, ${this.company.address.subdistrict.label}, ${this.company.address.district.label}, ${this.company.address.province.label}`;
  }

  public get fullName() {
    return this.company.name;
  }

  public generateShortAccountId() {
    return this.id.substring(0, 6).toUpperCase();
  }
}
