import { AccountRepository } from "@/app/(account)/_domain/_repositories/account";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { DateTime } from "luxon";
import { PersonalAccountEntity } from "../../_domain/_entities/personal-account";
import { AccountService } from "../_sources/account";
import { SessionEntity } from "@/app/(authentication)/_domain/_entities/session";
import { AccountVerificationWorkEntity } from "../../_domain/_entities/account-verification-work";

export class AccountRepositoryImpl implements AccountRepository {

  constructor(
    private readonly accountService: AccountService
  ) {
  }

  public async retrieveVerificationWork(accountId: string, session: SessionEntity): Promise<DataState<AccountVerificationWorkEntity>> {
    try {
      const work = await this.accountService.retrieveVerificationWork(accountId, session);
      return new DataSuccess(work.toEntity());
    } catch (err: any) {
      return new DataFailed(err);
    }
  }

  public async createPersonal(
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
    subdistrict:
      SubdistrictEntity,
    address: string,
    session: SessionEntity
  ): Promise<DataState<PersonalAccountEntity>> {
    try {
      const account = await this.accountService.createPersonal(
        nationality,
        idNumber,
        idDocument,
        fullName,
        occupation,
        pob,
        dob,
        province,
        city,
        district,
        subdistrict,
        address,
        session
      );

      return new DataSuccess(account.toEntity());
    } catch (err: any) {
      return new DataFailed(err);
    }
  }

}