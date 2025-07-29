import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { AccountType } from "@/features/account/domain/enums/account-type";

interface BusinessAccountModelConstructor {
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

export class BusinessAccountModel implements AbstractModel {
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

  constructor(args: BusinessAccountModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.company = args.company;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): BusinessAccountModel {
    return new BusinessAccountModel({
      id: doc["id"],
      type: doc["type"] as AccountType,
      company: {
        name: doc["company"]["name"],
        email: doc["company"]["email"],
        phoneNumber: doc["company"]["phone_number"],
        address: {
          province: {
            id: doc["company"]["address"]["province"]["id"],
            label: doc["company"]["address"]["province"]["label"],
          },
          city: {
            id: doc["company"]["address"]["city"]["id"],
            label: doc["company"]["address"]["city"]["label"],
          },
          district: {
            id: doc["company"]["address"]["district"]["id"],
            label: doc["company"]["address"]["district"]["label"],
          },
          subdistrict: {
            id: doc["company"]["address"]["subdistrict"]["id"],
            label: doc["company"]["address"]["subdistrict"]["label"],
          },
          address: doc["company"]["address"]["address"],
        },
      },
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined,
    });
  }

  public static fromLocalStorage(encodedData: string): BusinessAccountModel {
    const jsonAccount = atob(encodedData);
    const data = JSON.parse(jsonAccount);

    return new BusinessAccountModel({
      id: data.id,
      type: data.type,
      company: data.company,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  public static fromEntity(entity: BusinessAccountEntity) {
    return new BusinessAccountModel({
      id: entity.id,
      type: entity.type,
      company: entity.company,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  toEntity(): BusinessAccountEntity {
    return new BusinessAccountEntity({
      id: this.id,
      type: this.type,
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
