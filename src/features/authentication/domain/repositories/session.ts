import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "../entities/session";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export abstract class SessionRepository {
  public abstract signOut(): Promise<DataState<void>>;

  public abstract retrieve(): Promise<DataState<SessionEntity>>;

  public abstract saveSession(accessToken: string): Promise<DataState<SessionEntity>>;

  public abstract selectAccount(account: AccountTypeEntity): Promise<DataState<AccountTypeEntity>>;

  public abstract retrieveAccount(): Promise<DataState<PersonalAccountEntity>>;
}
