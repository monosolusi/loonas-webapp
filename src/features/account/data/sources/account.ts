import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { DateTime } from "luxon";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { PersonalAccountModel } from "../models/personal-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountVerificationWorkModel } from "../models/account-verification-work";
import { AccountBankAccountModel } from "../models/account-bank-account";

export abstract class AccountService {
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
  ): Promise<PersonalAccountModel>;

  public abstract retrieveVerificationWork(accountId: string, session: SessionEntity): Promise<AccountVerificationWorkModel> ;

  public abstract list(session: SessionEntity): Promise<PersonalAccountModel[]>;

  public abstract listBankAccount(params: {
    accountId: string
  }, session: SessionEntity): Promise<AccountBankAccountModel[]>;
}

export class AccountServiceImpl implements AccountService {

  constructor() {
  }

  public async listBankAccount(params: {
    accountId: string;
  }, session: SessionEntity): Promise<AccountBankAccountModel[]> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);
      if (!params.accountId) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/bank-accounts`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
      };

      const response = await fetch(url, { headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.map(AccountBankAccountModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async list(session: SessionEntity): Promise<PersonalAccountModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/accounts`;
      const headers = { Authorization: `Bearer ${session.accessToken}` };
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        else if (data.code === ErrorCodes.NOT_FOUND.code) throw new ServerError(ErrorCodes.NOT_FOUND, { message: data.message });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.map(PersonalAccountModel.fromJson);
    } catch (err: any) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async retrieveVerificationWork(accountId: string, session: SessionEntity): Promise<AccountVerificationWorkModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/accounts/${accountId}/verification-works`;
      const headers = { Authorization: `Bearer ${session.accessToken}` };
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return AccountVerificationWorkModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
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
    session: SessionEntity
  ): Promise<PersonalAccountModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // This should be checked previously, but it is better to check again
      const isoDob = dob.toISO();
      if (!isoDob) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${session.accessToken}`);

      const formData = new FormData();
      formData.append("nationality", nationality);
      formData.append("id_number", idNumber);
      formData.append("id_document", idDocument, idDocument.name);
      formData.append("full_name", fullName);
      formData.append("occupation", occupation.id);
      formData.append("place_of_birth", pob);
      formData.append("date_of_birth", isoDob);
      formData.append("province", province.label);
      formData.append("province_id", province.id);
      formData.append("city", city.label);
      formData.append("city_id", city.id);
      formData.append("district", district.label);
      formData.append("district_id", district.id);
      formData.append("subdistrict", subdistrict.label);
      formData.append("subdistrict_id", subdistrict.id);
      formData.append("address", address);

      const url = `${baseUrl}/accounts/personal`;
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
        redirect: "follow"
      });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return PersonalAccountModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}
