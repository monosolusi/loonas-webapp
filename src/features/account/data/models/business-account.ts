import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { MembershipModel } from "@/features/account/data/models/membership";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

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

type BusinessAccountModelConstructor = {
  id: string;
  type: AccountType;
  company: CompanyInformation;
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

export class BusinessAccountModel implements AbstractModel {
  public id: string;
  public type: AccountType;
  public company: CompanyInformation;
  public metadata: Metadata;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;
  public membership?: MembershipModel;
  public role?: string;
  public features?: string[];
  public readonly latestStatus?: VerificationStatus;
  public readonly verificationOutcome?: VerificationOutcome;

  constructor(args: BusinessAccountModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.company = args.company;
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
      metadata: { clerkId: doc["metadata"]["clerk_id"] },
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined,
      membership: doc["membership"] ? MembershipModel.fromJson(doc["membership"]) : undefined,
      role: doc["role"],
      features: Array.isArray(doc["features"]) ? doc["features"] : [],
      latestStatus: doc["latest_status"],
      verificationOutcome: doc["verification_outcome"],
    });
  }

  public static fromEntity(entity: BusinessAccountEntity) {
    return new BusinessAccountModel({
      id: entity.id,
      type: entity.type,
      company: entity.company,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  toEntity(): BusinessAccountEntity {
    return new BusinessAccountEntity({
      id: this.id,
      type: this.type,
      company: this.company,
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
