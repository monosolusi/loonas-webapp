import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "../entities/session";

export abstract class AuthRepository {
  public abstract signIn(email: string, password: string): Promise<DataState<SessionEntity>>;

  public abstract sendPasswordResetEmail(email: string): Promise<DataState<boolean>>;

  public abstract verifyResetToken(token: string): Promise<DataState<boolean>>;

  public abstract submitNewPassword(resetToken: string, password: string): Promise<DataState<boolean>>;
}