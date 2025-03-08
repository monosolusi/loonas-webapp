import { SessionEntity } from "@/app/(authentication)/_domain/_entities/session";
import { UserEntity } from "@/app/(user)/_domain/_entities/user";
import { DataState } from "@/core/resources/data-state";

export abstract class UserRepository {
  public abstract create(email: string, password: string): Promise<DataState<void>>;

  public abstract retrieveMe(session: SessionEntity): Promise<DataState<UserEntity>>;
}