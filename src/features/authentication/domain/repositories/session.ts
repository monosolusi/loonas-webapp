import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "../entities/session";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";

export abstract class SessionRepository {
  public abstract signOut(): Promise<DataState<void>>;

  public abstract retrieve(): Promise<DataState<SessionEntity>>;

  public abstract saveSession(accessToken: string): Promise<DataState<SessionEntity>>

  public abstract selectAccount(account: PersonalAccountEntity): Promise<DataState<PersonalAccountEntity>>;

  public abstract retrieveAccount(): Promise<DataState<PersonalAccountEntity>>;
}