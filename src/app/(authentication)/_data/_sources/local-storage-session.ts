import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionModel } from "../_models/session";

export abstract class SessionService {
  public abstract retrieve(): Promise<SessionModel>;

  public abstract signOut(): Promise<void>;

  public abstract saveSession(accessToken: string): Promise<SessionModel>;
}

export class LocalStorageSessionService implements SessionService {
  public saveSession(accessToken: string): Promise<SessionModel> {
    localStorage.setItem("accessToken", accessToken);
    return Promise.resolve(new SessionModel({ accessToken }));
  }

  public async signOut(): Promise<void> {
    localStorage.removeItem("accessToken");
  }

  public async retrieve(): Promise<SessionModel> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return new SessionModel({ accessToken });
  }
}