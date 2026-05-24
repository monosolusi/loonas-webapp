import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserRepository } from "@/features/user/domain/repositories/user";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { UserEntity } from "@/features/user/domain/entities/user";
import { UserService } from "@/features/user/domain/sources/user";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";

export class UserRepositoryImpl implements UserRepository {
  constructor(private userService: UserService) {}

  public async getStatus(session: SessionEntity): Promise<DataState<UserStatusEntity>> {
    try {
      const status = await this.userService.getStatus(session);
      return new DataSuccess(status.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

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
