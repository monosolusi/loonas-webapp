import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";
import { UserRepository } from "@/features/user/domain/repositories/user";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export class GetUserStatusUseCase implements UseCase<DataState<UserStatusEntity>, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: void): Promise<DataState<UserStatusEntity>> {
    try {
      const session = await this.getSession();
      const status = await this.getStatus(session);
      return new DataSuccess(status);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async getStatus(session: SessionEntity) {
    const status = await this.userRepository.getStatus(session);
    if (status instanceof DataFailed) throw status.error;
    if (!status.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return status.data;
  }

  private async getSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
