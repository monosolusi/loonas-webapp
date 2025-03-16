import { UseCase } from "@/core/resources/use-case";
import { SessionEntity } from "../entities/session";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "../repositories/session";


export class RetrieveSessionUseCase implements UseCase<DataState<SessionEntity>, void> {
  constructor(private sessionRepository: SessionRepository) {
  }

  public async execute(params: void): Promise<DataState<SessionEntity>> {
    return await this.sessionRepository.retrieve();
  }
}