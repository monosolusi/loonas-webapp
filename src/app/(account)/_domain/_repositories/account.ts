import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";
import { DataState } from "@/core/resources/data-state";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { DateTime } from "luxon";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { SessionEntity } from "@/app/(authentication)/_domain/_entities/session";
import { AccountVerificationWorkEntity } from "@/app/(account)/_domain/_entities/account-verification-work";

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
}