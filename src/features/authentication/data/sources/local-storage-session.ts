import { SessionModel } from "../models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { OccupationModel } from "@/core/utilities/occupation/data/models/occupation";
import { CityModel } from "@/core/utilities/address/data/model/city";
import { ProvinceModel } from "@/core/utilities/address/data/model/province";
import { PersonalAccountModel } from "@/features/account/data/models/personal-account";
import { DistrictModel } from "@/core/utilities/address/data/model/district";
import { SubdistrictModel } from "@/core/utilities/address/data/model/subdistrict";
import { mutate } from "swr";
import { AccountTypeEntity, AccountTypeModel } from "@/features/account/domain/types/account-type";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { BusinessAccountModel } from "@/features/account/data/models/business-account";

export abstract class SessionService {
  public abstract retrieve(): Promise<SessionModel>;

  public abstract signOut(): Promise<void>;

  public abstract saveSession(accessToken: string): Promise<SessionModel>;

  public abstract selectAccount(account: AccountTypeEntity): Promise<AccountTypeModel>;

  public abstract retrieveSelectedAccount(): Promise<PersonalAccountModel>;
}

export class LocalStorageSessionService implements SessionService {
  public async retrieveSelectedAccount(): Promise<PersonalAccountModel> {
    const encodedAccount = localStorage.getItem("selectedAccount");
    if (!encodedAccount) throw new ServerError(ErrorCodes.NOT_FOUND);

    const jsonAccount = atob(encodedAccount);
    const account = JSON.parse(jsonAccount);
    return new PersonalAccountModel({
      id: account.id,
      nationality: account.nationality,
      idNumber: account.idNumber,
      fullName: account.fullName,
      occupation: new OccupationModel({ id: account.occupation.id, label: account.occupation.label }),
      pob: account.pob,
      dob: account.dob,
      province: new ProvinceModel({ id: account.province.id, label: account.province.label }),
      city: new CityModel({ id: account.city.id, label: account.city.label }),
      district: new DistrictModel({ id: account.district.id, label: account.district.label }),
      subdistrict: new SubdistrictModel({ id: account.subdistrict.id, label: account.subdistrict.label }),
      address: account.address,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      deletedAt: account.deletedAt,
    });
  }

  public async selectAccount(account: AccountTypeEntity): Promise<AccountTypeModel> {
    const jsonAccount = JSON.stringify(account);
    const encodedAccount = btoa(jsonAccount);
    localStorage.setItem("selectedAccount", encodedAccount);

    if (account instanceof PersonalAccountEntity) {
      return new PersonalAccountModel({
        id: account.id,
        nationality: account.nationality,
        idNumber: account.idNumber,
        fullName: account.fullName,
        occupation: new OccupationModel({ id: account.occupation.id, label: account.occupation.label }),
        pob: account.pob,
        dob: account.dob,
        province: new ProvinceModel({ id: account.province.id, label: account.province.label }),
        city: new CityModel({ id: account.city.id, label: account.city.label }),
        district: new DistrictModel({ id: account.district.id, label: account.district.label }),
        subdistrict: new SubdistrictModel({ id: account.subdistrict.id, label: account.subdistrict.label }),
        address: account.address,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        deletedAt: account.deletedAt,
      });
    } else if (account instanceof BusinessAccountEntity) {
      return new BusinessAccountModel({
        id: account.id,
        company: account.company,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        deletedAt: account.deletedAt,
      });
    } else throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  public saveSession(accessToken: string): Promise<SessionModel> {
    localStorage.setItem("accessToken", accessToken);
    return Promise.resolve(new SessionModel({ accessToken }));
  }

  public async signOut(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedAccount");

    await mutate(() => true, undefined, { revalidate: false });
  }

  public async retrieve(): Promise<SessionModel> {
    const hasSelectedAccount = await this.hasSelectedAccount();
    const accessToken = localStorage.getItem("accessToken");
    const selectedAccount = hasSelectedAccount ? await this.retrieveSelectedAccount() : undefined;

    if (!accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return new SessionModel({ accessToken, selectedAccount });
  }

  private async hasSelectedAccount() {
    try {
      const selectedAccount = await this.retrieveSelectedAccount();
      if (selectedAccount) return true;
      else return false;
    } catch (err) {
      if (err instanceof ServerError) {
        if (err.code === ErrorCodes.NOT_FOUND.code) return false;
        else throw err;
      } else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
