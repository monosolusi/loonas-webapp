import { DateTime } from "luxon";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { DistrictModel } from "@/core/utilities/address/data/model/district";
import { SubdistrictModel } from "@/core/utilities/address/data/model/subdistrict";
import { OccupationModel } from "@/core/utilities/occupation/data/models/occupation";
import { ProvinceModel } from "@/core/utilities/address/data/model/province";
import { CityModel } from "@/core/utilities/address/data/model/city";
import { AbstractModel } from "@/core/resources/model";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { MembershipModel } from "@/features/account/data/models/membership";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

type Metadata = { clerkId: string };

type PersonalAccountModelConstructor = {
  id: string;
  type: AccountType;
  nationality: string;
  idNumber: string;
  fullName: string;
  occupation: OccupationModel;
  pob: string;
  dob: DateTime;
  province: ProvinceModel;
  city: CityModel;
  district: DistrictModel;
  subdistrict: SubdistrictModel;
  address: string;
  metadata: Metadata;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
  membership?: MembershipModel;
  role?: string;
  features?: string[];
  latestStatus?: VerificationStatus;
  verificationOutcome?: VerificationOutcome;
};

export class PersonalAccountModel implements AbstractModel {
  public readonly id: string;
  public readonly type: AccountType;
  public readonly nationality: string;
  public readonly idNumber: string;
  public readonly fullName: string;
  public readonly occupation: OccupationModel;
  public readonly pob: string;
  public readonly dob: DateTime;
  public readonly province: ProvinceModel;
  public readonly city: CityModel;
  public readonly district: DistrictModel;
  public readonly subdistrict: SubdistrictModel;
  public readonly address: string;
  public readonly metadata: Metadata;
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt?: DateTime;
  public readonly membership?: MembershipModel;
  public readonly role?: string;
  public readonly features?: string[];
  public readonly latestStatus?: VerificationStatus;
  public readonly verificationOutcome?: VerificationOutcome;

  constructor(args: PersonalAccountModelConstructor) {
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
    this.role = args.role;
    this.features = args.features;
    this.latestStatus = args.latestStatus;
    this.verificationOutcome = args.verificationOutcome;
  }

  public static fromJson(data: Record<string, any>): PersonalAccountModel {
    return new PersonalAccountModel({
      id: data["id"],
      type: data["type"] as AccountType,
      nationality: data["nationality"],
      idNumber: data["id_number"],
      fullName: data["full_name"],
      occupation: new OccupationModel({ id: data["occupation"] }),
      pob: data["place_of_birth"],
      dob: DateTime.fromISO(data["date_of_birth"]),
      province: new ProvinceModel({ id: data["province_id"], label: data["province"] }),
      city: new CityModel({ id: data["city_id"], label: data["city"] }),
      district: new DistrictModel({ id: data["district_id"], label: data["district"] }),
      subdistrict: new SubdistrictModel({ id: data["subdistrict_id"], label: data["subdistrict"] }),
      address: data["address"],
      metadata: { clerkId: data["metadata"]["clerk_id"] },
      createdAt: DateTime.fromISO(data["created_at"]),
      updatedAt: DateTime.fromISO(data["updated_at"]),
      deletedAt: data["deleted_at"] ? DateTime.fromISO(data["deleted_at"]) : undefined,
      membership: data["membership"] ? MembershipModel.fromJson(data["membership"]) : undefined,
      role: data["role"],
      features: Array.isArray(data["features"]) ? data["features"] : [],
      latestStatus: data["latest_status"],
      verificationOutcome: data["verification_outcome"],
    });
  }

  public static fromEntity(entity: PersonalAccountEntity) {
    return new PersonalAccountModel({
      id: entity.id,
      type: entity.type,
      nationality: entity.nationality,
      idNumber: entity.idNumber,
      fullName: entity.fullName,
      occupation: new OccupationModel({ id: entity.occupation.id, label: entity.occupation.label }),
      pob: entity.pob,
      dob: entity.dob,
      province: new ProvinceModel({ id: entity.province.id, label: entity.province.label }),
      city: new CityModel({ id: entity.city.id, label: entity.city.label }),
      district: new DistrictModel({ id: entity.district.id, label: entity.district.label }),
      subdistrict: new SubdistrictModel({ id: entity.subdistrict.id, label: entity.subdistrict.label }),
      address: entity.address,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  toEntity(): PersonalAccountEntity {
    return new PersonalAccountEntity({
      id: this.id,
      type: this.type,
      nationality: this.nationality,
      idNumber: this.idNumber,
      fullName: this.fullName,
      occupation: this.occupation.toEntity(),
      pob: this.pob,
      dob: this.dob,
      province: this.province.toEntity(),
      city: this.city.toEntity(),
      district: this.district.toEntity(),
      subdistrict: this.subdistrict.toEntity(),
      address: this.address,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      membership: this.membership?.toEntity(),
      role: this.role,
      features: this.features,
      latestStatus: this.latestStatus,
      verificationOutcome: this.verificationOutcome,
    });
  }
}
