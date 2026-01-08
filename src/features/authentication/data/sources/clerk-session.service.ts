import { AccountTypeEntity, AccountTypeModel } from "@/features/account/domain/types/account-type";
import { SessionService } from "@/features/authentication/domain/sources/session";
import { SessionModel } from "../models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type ClerkSessionServiceConstructorParams = {
  getToken: () => Promise<string | null>;
};

export class ClerkSessionService implements SessionService {
  private readonly getToken: () => Promise<string | null>;

  constructor(args: ClerkSessionServiceConstructorParams) {
    this.getToken = args.getToken;
    Object.freeze(this);
  }

  async retrieve(): Promise<SessionModel> {
    const token = await this.getToken();
    if (!token) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return new SessionModel({ accessToken: token });
  }

  signOut(): Promise<void> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  saveSession(accessToken: string): Promise<SessionModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  selectAccount(account: AccountTypeEntity): Promise<AccountTypeModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  retrieveSelectedAccount(): Promise<AccountTypeModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }
}
