import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserModel } from "@/features/user/data/models/user";

export interface UserService {
  create(email: string, password: string): Promise<void>;

  retrieveMe(session: SessionEntity): Promise<UserModel>;
}
