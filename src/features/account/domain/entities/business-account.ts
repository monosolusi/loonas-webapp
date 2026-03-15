import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { MembershipEntity } from "@/features/account/domain/entities/membership";

type Metadata = { clerkId: string };

type AddressInformation = {
  province: { id: string; label: string };
  city: { id: string; label: string };
  district: { id: string; label: string };
  subdistrict: { id: string; label: string };
  address: string;
};

type CompanyInformation = {
  name: string;
  email: string;
  phoneNumber: string;
  address: AddressInformation;
};

type BusinessAccountEntityConstructor = {
  id: string;
  type: AccountType;
  company: CompanyInformation;
  metadata: Metadata;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
  membership?: MembershipEntity;
};

export class BusinessAccountEntity implements AbstractEntity {
  public id: string;
  public type: AccountType;
  public company: CompanyInformation;
  public metadata: Metadata;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;
  public membership?: MembershipEntity;

  constructor(args: BusinessAccountEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.company = args.company;
    this.metadata = args.metadata;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
    this.membership = args.membership;
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
