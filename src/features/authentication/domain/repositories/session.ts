import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "../entities/session";

export abstract class SessionRepository {
  public abstract signOut(): Promise<DataState<void>>;

  public abstract retrieve(): Promise<DataState<SessionEntity>>;

  public abstract saveSession(accessToken: string): Promise<DataState<SessionEntity>>;
}
