import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionRepository } from "../../_domain/_repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "../../_domain/_entities/session";
import { SessionService } from "../_sources/local-storage-session";
import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";

export class SessionRepositoryImpl implements SessionRepository {
  constructor(private sessionService: SessionService) {
  }

  public async retrieveAccount(): Promise<DataState<PersonalAccountEntity>> {
    try {
      const selectedAccount = await this.sessionService.retrieveSelectedAccount();
      return new DataSuccess(selectedAccount.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async selectAccount(account: PersonalAccountEntity): Promise<DataState<PersonalAccountEntity>> {
    try {
      const newAccount = await this.sessionService.selectAccount(account);
      return new DataSuccess(newAccount.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async saveSession(accessToken: string): Promise<DataState<SessionEntity>> {
    try {
      const session = await this.sessionService.saveSession(accessToken);
      return new DataSuccess(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async retrieve(): Promise<DataState<SessionEntity>> {
    try {
      const session = await this.sessionService.retrieve();
      return new DataSuccess(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async signOut(): Promise<DataState<void>> {
    try {
      await this.sessionService.signOut();
      return new DataSuccess();
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}