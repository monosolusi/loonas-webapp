import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "../repositories/session";
import { UserRepository } from "@/features/user/domain/repositories/user";
import { UserEntity } from "@/features/user/domain/entities/user";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";


export class CheckSessionUseCase implements UseCase<DataState<UserEntity>, void> {
  constructor(
    private sessionRepository: SessionRepository,
    private userRepository: UserRepository
  ) {
  }

  public async execute(params: void): Promise<DataState<UserEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

      const user = await this.userRepository.retrieveMe(session.data);
      if (user instanceof DataFailed) return user;
      if (!user.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
      return user;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}