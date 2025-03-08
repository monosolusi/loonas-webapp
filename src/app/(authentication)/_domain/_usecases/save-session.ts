import { UseCase } from "@/core/resources/use-case";
import { SessionEntity } from "../_entities/session";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "../_repositories/session";

export class SaveSessionUseCaseParams {
  constructor(public accessToken: string) {
  }
}

export class SaveSessionUseCase implements UseCase<DataState<SessionEntity>, SaveSessionUseCaseParams> {
  constructor(private sessionRepository: SessionRepository) {
  }

  public async execute(params: SaveSessionUseCaseParams): Promise<DataState<SessionEntity>> {
    return await this.sessionRepository.saveSession(params.accessToken);
  }
}