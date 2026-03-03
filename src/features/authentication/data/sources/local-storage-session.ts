import { SessionModel } from "../models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { mutate } from "swr";
import { AccountTypeEntity, AccountTypeModel } from "@/features/account/domain/types/account-type";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";
import { BusinessAccountModel } from "@/features/account/data/models/business-account";
import { SessionService } from "@/features/authentication/domain/sources/session";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { PersonalAccountModel } from "@/features/account/data/models/personal-account";

/**
 * @deprecated Use `ClerkSessionService` from `@/features/authentication/data/sources/clerk-session.service` instead.
 * LocalStorage-based session no longer has a valid `selectedAccount` since the SelectedAccountProvider was deprecated.
 */
export class LocalStorageSessionService implements SessionService {
  public async retrieveSelectedAccount(): Promise<AccountTypeModel> {
    const encodedAccount = localStorage.getItem("selectedAccount");
    if (!encodedAccount) throw new ServerError(ErrorCodes.NOT_FOUND);

    const jsonAccount = atob(encodedAccount);
    const account = JSON.parse(jsonAccount);

    if (account.type === AccountType.PERSONAL) {
      return PersonalAccountModel.fromLocalStorage(encodedAccount);
    } else if (account.type === AccountType.BUSINESS) {
      return BusinessAccountModel.fromLocalStorage(encodedAccount);
    } else throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  public async selectAccount(account: AccountTypeEntity): Promise<AccountTypeModel> {
    const jsonAccount = JSON.stringify(account);
    const encodedAccount = btoa(jsonAccount);
    localStorage.setItem("selectedAccount", encodedAccount);

    if (account instanceof PersonalAccountEntity) {
      return PersonalAccountModel.fromEntity(account);
    } else if (account instanceof BusinessAccountEntity) {
      return BusinessAccountModel.fromEntity(account);
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
