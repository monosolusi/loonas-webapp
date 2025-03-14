import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "../_entities/session";

export abstract class AuthRepository {
  abstract signIn(email: string, password: string): Promise<DataState<SessionEntity>>;

  abstract sendPasswordResetEmail(email: string): Promise<DataState<boolean>>;
}