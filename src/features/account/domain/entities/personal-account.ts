import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";

interface PersonalAccountEntityConstructor {
  id: string;
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
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PersonalAccountEntity implements AbstractEntity {
  public id: string;
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
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: PersonalAccountEntityConstructor) {
    this.id = args.id;
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
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public generateShortAccountId() {
    return this.id.substring(0, 6).toUpperCase();
  }
}