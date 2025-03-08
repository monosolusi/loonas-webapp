import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/app/(authentication)/_domain/_repositories/session";

export class UserSignOutUseCase implements UseCase<DataState<void>, void> {
  constructor(private sessionRepository: SessionRepository) {
  }

  public async execute(params: void): Promise<DataState<void>> {
    return this.sessionRepository.signOut();
  }

}