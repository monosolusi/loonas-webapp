import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";

interface BusinessAccountModelConstructor {
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

export class BusinessAccountModel implements AbstractModel {
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

  constructor(args: BusinessAccountModelConstructor) {
    this.id = args.id;
    this.company = args.company;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): BusinessAccountModel {
    return new BusinessAccountModel({
      id: doc["id"],
      company: {
        name: doc["company"]["name"],
        email: doc["company"]["email"],
        phoneNumber: doc["company"]["phone_number"],
        address: {
          province: { id: doc["company"]["address"]["province"]["id"] },
          city: { id: doc["company"]["address"]["city"]["id"] },
          district: { id: doc["company"]["address"]["district"]["id"] },
          subdistrict: { id: doc["company"]["address"]["subdistrict"]["id"] },
          address: doc["company"]["address"]["address"],
        },
      },
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined,
    });
  }

  toEntity(): BusinessAccountEntity {
    return new BusinessAccountEntity({
      id: this.id,
      company: {
        name: this.company.name,
        email: this.company.email,
        phoneNumber: this.company.phoneNumber,
        address: {
          province: this.company.address.province,
          city: this.company.address.city,
          district: this.company.address.district,
          subdistrict: this.company.address.subdistrict,
          address: this.company.address.address,
        },
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    });
  }
}
