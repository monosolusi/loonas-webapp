import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { MembershipEntity } from "@/features/account/domain/entities/membership";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

type Metadata = { clerkId: string };

type PersonalAccountEntityConstructor = {
  id: string;
  type: AccountType;
  nationality: string;
  idNumber: string;
  fullName: string;
  occupation: OccupationEntity;
  pob: string;
  dob: DateTime;
  province: ProvinceEntity;
  city: CityEntity;
  district: DistrictEntity;
  subdistrict: SubdistrictEntity;
  address: string;
  metadata: Metadata;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
  membership?: MembershipEntity;
  role?: string;
  features?: string[];
  latestStatus?: VerificationStatus;
  verificationOutcome?: VerificationOutcome;
};

export class PersonalAccountEntity implements AbstractEntity {
  public id: string;
  public type: AccountType;
  public nationality: string;
  public idNumber: string;
  public fullName: string;
  public occupation: OccupationEntity;
  public pob: string;
  public dob: DateTime;
  public province: ProvinceEntity;
  public city: CityEntity;
  public district: DistrictEntity;
  public subdistrict: SubdistrictEntity;
  public address: string;
  public metadata: Metadata;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;
  public membership?: MembershipEntity;
  public role: string;
  public features: string[];
  public latestStatus?: VerificationStatus;
  public verificationOutcome?: VerificationOutcome;

  constructor(args: PersonalAccountEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.nationality = args.nationality;
    this.idNumber = args.idNumber;
    this.fullName = args.fullName;
    this.occupation = args.occupation;
    this.pob = args.pob;
    this.dob = args.dob;
    this.province = args.province;
    this.city = args.city;
    this.district = args.district;
    this.subdistrict = args.subdistrict;
    this.address = args.address;
    this.metadata = args.metadata;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
    this.membership = args.membership;
    this.role = args.role ?? "user";
    this.features = args.features ?? [];
    this.latestStatus = args.latestStatus;
    this.verificationOutcome = args.verificationOutcome;
  }

  public hasFeature(feature: string): boolean {
    return this.features.includes(feature);
  }

  public get fullAddress() {
    return `${this.address}, ${this.subdistrict.label}, ${this.district.label}, ${this.city.label}, ${this.province.label}`;
  }

  public generateShortAccountId() {
    return this.id.substring(0, 6).toUpperCase();
  }
}
