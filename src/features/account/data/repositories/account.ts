import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { DateTime } from "luxon";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { AccountRepository, CreateBusinessParams } from "@/features/account/domain/repositories/account";
import { AccountBankAccountEntity } from "../../domain/entities/account-bank-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BusinessAccountEntity } from "../../domain/entities/business-account";
import { AccountService } from "@/features/account/domain/sources/account";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly accountService: AccountService) {}

  public async createBusiness(
    params: CreateBusinessParams,
    session: SessionEntity,
  ): Promise<DataState<BusinessAccountEntity>> {
    try {
      const account = await this.accountService.createBusiness(params, session);
      return new DataSuccess(account.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listBankAccount(
    account: { id: string },
    session: SessionEntity,
  ): Promise<DataState<AccountBankAccountEntity[]>> {
    try {
      const accounts = await this.accountService.listBankAccount({ accountId: account.id }, session);
      return new DataSuccess(accounts.map((account) => account.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async list(session: SessionEntity): Promise<DataState<AccountTypeEntity[]>> {
    try {
      const accounts = await this.accountService.list(session);
      return new DataSuccess(accounts.map((account) => account.toEntity()));
    } catch (err: any) {
      return new DataFailed(err);
    }
  }

  public async retrieveVerificationWork(
    accountId: string,
    session: SessionEntity,
  ): Promise<DataState<AccountVerificationWorkEntity>> {
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
    subdistrict: SubdistrictEntity,
    address: string,
    session: SessionEntity,
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
        session,
      );

      return new DataSuccess(account.toEntity());
    } catch (err: any) {
      return new DataFailed(err);
    }
  }
}
