import { SessionModel } from "@/features/authentication/data/models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { mutate } from "swr";
import { SessionService } from "@/features/authentication/domain/sources/session";

/**
 * @deprecated Use `ClerkSessionService` from `@/features/authentication/data/sources/clerk-session.service` instead.
 */
export class LocalStorageSessionService implements SessionService {
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
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return new SessionModel({ accessToken });
  }
}
