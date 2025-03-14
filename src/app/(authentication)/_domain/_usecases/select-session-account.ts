import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";
import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/app/(authentication)/_domain/_repositories/session";

export class SelectSessionAccountUseCaseParams {
  constructor(public readonly newAccount: PersonalAccountEntity) {
  }
}

export class SelectSessionAccountUseCase implements UseCase<DataState<PersonalAccountEntity>, SelectSessionAccountUseCaseParams> {

  constructor(private sessionRepository: SessionRepository) {
  }

  public async execute(params: SelectSessionAccountUseCaseParams): Promise<DataState<PersonalAccountEntity>> {
    return this.sessionRepository.selectAccount(params.newAccount);
  }

}