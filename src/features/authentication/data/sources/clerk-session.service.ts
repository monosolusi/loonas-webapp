import { AccountTypeEntity, AccountTypeModel } from "@/features/account/domain/types/account-type";
import { SessionService } from "@/features/authentication/domain/sources/session";
import { SessionModel } from "../models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { ClerkAccountModel } from "@/features/account/data/models/clerk-account.model";

type ClerkSessionServiceConstructorParams = {
  clerk: ReturnType<typeof useClerk>;
};

export class ClerkSessionService implements SessionService {
  private readonly clerk: ReturnType<typeof useClerk>;

  constructor(args: ClerkSessionServiceConstructorParams) {
    this.clerk = args.clerk;
    Object.freeze(this);
  }

  public async retrieve(): Promise<SessionModel> {
    if (!this.clerk.session) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

    const token = await this.clerk.session.getToken();
    if (!token) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

    if (this.clerk.organization) {
      const selectedAccount = new ClerkAccountModel({ id: this.clerk.organization.id });
      return new SessionModel({ accessToken: token, selectedAccount });
    }

    return new SessionModel({ accessToken: token });
  }

  signOut(): Promise<void> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  saveSession(_accessToken: string): Promise<SessionModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  selectAccount(_account: AccountTypeEntity): Promise<AccountTypeModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  retrieveSelectedAccount(): Promise<AccountTypeModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }
}
