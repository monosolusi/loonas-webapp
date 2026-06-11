import { UseCase } from "@/core/resources/use-case";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";


export class RetrieveSessionUseCase implements UseCase<DataState<SessionEntity>, void> {
  constructor(private sessionRepository: SessionRepository) {
  }

  public async execute(): Promise<DataState<SessionEntity>> {
    return await this.sessionRepository.retrieve();
  }
}