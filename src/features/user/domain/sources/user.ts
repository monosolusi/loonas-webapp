import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserModel } from "@/features/user/data/models/user";
import { UserStatusModel } from "@/features/user/data/models/user-status.model";

export interface UserService {
  create(email: string, password: string): Promise<void>;

  retrieveMe(session: SessionEntity): Promise<UserModel>;

  getStatus(session: SessionEntity): Promise<UserStatusModel>;
}
