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
import { AccountService, CreateBusinessParams } from "@/features/account/domain/sources/account";
import { BusinessAccountModel } from "../models/business-account";
import { HttpRequest } from "@/core/helpers/http-request";

export class AccountServiceImpl implements AccountService {
  constructor(private readonly http: HttpRequest) {}

  public async createBusiness(params: CreateBusinessParams, session: SessionEntity): Promise<BusinessAccountModel> {
    try {
      const path = "/accounts/business";
      const method = "POST";
      const formData = new FormData();
      formData.append("company_name", params.company.name);
      formData.append("company_email", params.company.email);
      formData.append("company_phone_number", params.company.phoneNumber);
      formData.append("company_address", params.company.address.address);
      formData.append("company_address_province_id", params.company.address.province.id);
      formData.append("company_address_city_id", params.company.address.city.id);
      formData.append("company_address_district_id", params.company.address.district.id);
      formData.append("company_address_subdistrict_id", params.company.address.subdistrict.id);
      formData.append("company_deed_of_establishment", params.company.deedOfEstablishment);
      formData.append("company_business_identification_number", params.company.businessIdentificationNumber);
      formData.append("director_national_identity_card", params.director.nationalIdentityCard);

      if (params.company.financial.statement) {
        formData.append("company_financial_statement", params.company.financial.statement);
      }

      if (params.company.financial.bankStatement) {
        formData.append("company_financial_bank_statement", params.company.financial.bankStatement);
      }

      if (params.company.mostRecentDeedOfAmendment) {
        formData.append("company_most_recent_deed_of_amendment", params.company.mostRecentDeedOfAmendment);
      }

      const result = await this.http.request(
        {
          path,
          method,
          body: formData,
          session,
        },
        { contentType: undefined },
      );

      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return BusinessAccountModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listBankAccount(
    params: {
      accountId: string;
    },
    session: SessionEntity,
  ): Promise<AccountBankAccountModel[]> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);
      if (!params.accountId) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/accounts/bank-accounts`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id,
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
        else if (data.code === ErrorCodes.NOT_FOUND.code)
          throw new ServerError(ErrorCodes.NOT_FOUND, { message: data.message });
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return data.map(PersonalAccountModel.fromJson);
    } catch (err: any) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async retrieveVerificationWork(
    accountId: string,
    session: SessionEntity,
  ): Promise<AccountVerificationWorkModel> {
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
    session: SessionEntity,
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
        redirect: "follow",
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
