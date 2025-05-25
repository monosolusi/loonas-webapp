import { DateTime } from "luxon";
import { DataState } from "@/core/resources/data-state";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PersonalAccountEntity } from "../entities/personal-account";
import { AccountVerificationWorkEntity } from "../entities/account-verification-work";
import { AccountBankAccountEntity } from "@/features/account/domain/entities/account-bank-account";

export abstract class AccountRepository {
  public abstract createPersonal(
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
    session: SessionEntity
  ): Promise<DataState<PersonalAccountEntity>>

  public abstract retrieveVerificationWork(accountId: string, session: SessionEntity): Promise<DataState<AccountVerificationWorkEntity>>

  public abstract list(session: SessionEntity): Promise<DataState<PersonalAccountEntity[]>>

  public abstract listBankAccount(account: PersonalAccountEntity, session: SessionEntity): Promise<DataState<AccountBankAccountEntity[]>>
}
