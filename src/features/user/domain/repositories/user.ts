import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserEntity } from "@/features/user/domain/entities/user";
import { DataState } from "@/core/resources/data-state";

export abstract class UserRepository {
  public abstract create(email: string, password: string): Promise<DataState<void>>;

  public abstract retrieveMe(session: SessionEntity): Promise<DataState<UserEntity>>;
}