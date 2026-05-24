import { DateTime } from "luxon";
import { DataState } from "@/core/resources/data-state";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { AccountBankAccountEntity } from "@/features/account/domain/entities/account-bank-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

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

export interface AccountRepository {
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
  ): Promise<DataState<PersonalAccountEntity>>;

  createBusiness(params: CreateBusinessParams, session: SessionEntity): Promise<DataState<BusinessAccountEntity>>;

  retrieveVerificationWork(
    accountId: string,
    session: SessionEntity,
  ): Promise<DataState<AccountVerificationWorkEntity>>;

  list(session: SessionEntity): Promise<DataState<AccountTypeEntity[]>>;

  listBankAccount(session: SessionEntity): Promise<DataState<AccountBankAccountEntity[]>>;

  getCurrent(session: SessionEntity): Promise<DataState<AccountTypeEntity>>;
}
