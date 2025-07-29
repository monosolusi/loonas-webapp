import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export class SelectSessionAccountUseCaseParams {
  constructor(public readonly newAccount: AccountTypeEntity) {}
}

export class SelectSessionAccountUseCase
  implements UseCase<DataState<AccountTypeEntity>, SelectSessionAccountUseCaseParams>
{
  constructor(private sessionRepository: SessionRepository) {}

  public async execute(params: SelectSessionAccountUseCaseParams): Promise<DataState<AccountTypeEntity>> {
    return this.sessionRepository.selectAccount(params.newAccount);
  }
}
