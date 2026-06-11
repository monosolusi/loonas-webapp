import { SessionModel } from "@/features/authentication/data/models/session";

export interface SessionService {
  retrieve(): Promise<SessionModel>;

  signOut(): Promise<void>;

  saveSession(accessToken: string): Promise<SessionModel>;
}
