import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";
import { SessionRepository } from "@/app/(authentication)/_domain/_repositories/session";

export class RetrieveSessionAccountUseCase implements UseCase<DataState<PersonalAccountEntity>, void> {

  constructor(private readonly sessionRepository: SessionRepository) {
  }

  public async execute(params: void): Promise<DataState<PersonalAccountEntity>> {
    return this.sessionRepository.retrieveAccount();
  }

}