import { CityModel } from "@/core/utilities/address/data/model/city";
import { DistrictModel } from "@/core/utilities/address/data/model/district.ts";
import { ProvinceModel } from "@/core/utilities/address/data/model/province";
import { SubdistrictModel } from "@/core/utilities/address/data/model/subdistrict.ts";
import { OccupationModel } from "@/core/utilities/occupation/data/models/occupation";
import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";

interface PersonalAccountModelConstructor {
  id: string;
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
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class PersonalAccountModel implements AbstractModel {
  public readonly id: string;
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
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;
  public readonly deletedAt?: DateTime;

  constructor(args: PersonalAccountModelConstructor) {
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

  public static fromJson(data: Record<string, any>): PersonalAccountModel {
    return new PersonalAccountModel({
      id: data["id"],
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
      createdAt: DateTime.fromISO(data["created_at"]),
      updatedAt: DateTime.fromISO(data["updated_at"]),
      deletedAt: data["deleted_at"] ? DateTime.fromISO(data["deleted_at"]) : undefined
    });
  }

  toEntity(): PersonalAccountEntity {
    return new PersonalAccountEntity({
      id: this.id,
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    });
  }

}