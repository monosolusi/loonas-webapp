import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserEntity } from "@/features/user/domain/entities/user";
import { DataState } from "@/core/resources/data-state";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";

export interface UserRepository {
  create(email: string, password: string): Promise<DataState<void>>;

  retrieveMe(session: SessionEntity): Promise<DataState<UserEntity>>;

  getStatus(session: SessionEntity): Promise<DataState<UserStatusEntity>>;
}
