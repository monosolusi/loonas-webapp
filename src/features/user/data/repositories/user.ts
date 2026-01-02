import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserRepository } from "@/features/user/domain/repositories/user";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { UserEntity } from "../../domain/entities/user";
import { UserService } from "@/features/user/domain/sources/user";

export class UserRepositoryImpl implements UserRepository {
  constructor(private userService: UserService) {}

  public async create(email: string, password: string): Promise<DataState<void>> {
    try {
      await this.userService.create(email, password);
      return new DataSuccess();
    } catch (err: any) {
      return new DataFailed(err);
    }
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
