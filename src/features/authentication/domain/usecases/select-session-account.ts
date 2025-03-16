import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";

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