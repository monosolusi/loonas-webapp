import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/app/(authentication)/_domain/_repositories/session";
import { UserEntity } from "../_entities/user";
import { UserRepository } from "@/app/(user)/_domain/_repositories/user";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class RetrieveMeUseCase implements UseCase<DataState<UserEntity>, void> {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: void): Promise<DataState<UserEntity>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    const user = await this.userRepository.retrieveMe(session.data);
    if (user instanceof DataFailed) return user;
    return user;
  }

}