import { SessionEntity } from "@/app/(authentication)/_domain/_entities/session";
import { UserRepository } from "@/app/(user)/_domain/_repositories/user";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { UserEntity } from "../../_domain/_entities/user";
import { UserService } from "../_data/user";

export class UserRepositoryImpl implements UserRepository {
  constructor(private userService: UserService) {
  }

  public async retrieveMe(session: SessionEntity): Promise<DataState<UserEntity>> {
    try {
      const user = await this.userService.retrieveMe(session);
      return new DataSuccess(user.toEntity());
    } catch (err: any) {
      return new DataFailed(err);
    }
  }
}