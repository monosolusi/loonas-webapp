import { SessionModel } from "@/features/authentication/data/models/session";
import { AccountTypeEntity, AccountTypeModel } from "@/features/account/domain/types/account-type";

export interface SessionService {
  retrieve(): Promise<SessionModel>;

  signOut(): Promise<void>;

  saveSession(accessToken: string): Promise<SessionModel>;

  selectAccount(account: AccountTypeEntity): Promise<AccountTypeModel>;

  retrieveSelectedAccount(): Promise<AccountTypeModel>;
}
