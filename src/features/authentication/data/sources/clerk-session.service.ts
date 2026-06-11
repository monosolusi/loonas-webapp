import { SessionService } from "@/features/authentication/domain/sources/session";
import { SessionModel } from "@/features/authentication/data/models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";

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

    return new SessionModel({ accessToken: token });
  }

  signOut(): Promise<void> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  saveSession(_accessToken: string): Promise<SessionModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }
}
