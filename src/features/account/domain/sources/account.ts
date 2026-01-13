import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { DateTime } from "luxon";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PersonalAccountModel } from "@/features/account/data/models/personal-account";
import { AccountVerificationWorkModel } from "@/features/account/data/models/account-verification-work";
import { AccountBankAccountModel } from "@/features/account/data/models/account-bank-account";
import { BusinessAccountModel } from "@/features/account/data/models/business-account";
import { AccountTypeModel } from "@/features/account/domain/types/account-type";

export interface CreateBusinessParams {
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
    deedOfEstablishment: File;
    mostRecentDeedOfAmendment?: File;
    businessIdentificationNumber: File;
    financial: {
      statement?: File;
      bankStatement?: File;
    };
  };
  director: {
    nationalIdentityCard: File;
  };
}

export interface AccountService {
  createPersonal(
    nationality: string,
    idNumber: string,
    idDocument: File,
    fullName: string,
    occupation: OccupationEntity,
    pob: string,
    dob: DateTime,
    province: ProvinceEntity,
    city: CityEntity,
    district: DistrictEntity,
    subdistrict: SubdistrictEntity,
    address: string,
    session: SessionEntity,
  ): Promise<PersonalAccountModel>;

  createBusiness(params: CreateBusinessParams, session: SessionEntity): Promise<BusinessAccountModel>;

  retrieveVerificationWork(accountId: string, session: SessionEntity): Promise<AccountVerificationWorkModel>;

  list(session: SessionEntity): Promise<AccountTypeModel[]>;

  listBankAccount(
    params: {
      accountId: string;
    },
    session: SessionEntity,
  ): Promise<AccountBankAccountModel[]>;

  getCurrent(session: SessionEntity): Promise<AccountTypeModel>;
}
