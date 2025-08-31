import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export class RetrieveSessionAccountUseCase implements UseCase<DataState<AccountTypeEntity>, void> {
  constructor(private readonly sessionRepository: SessionRepository) {}

  public async execute(params: void): Promise<DataState<AccountTypeEntity>> {
    return this.sessionRepository.retrieveAccount();
  }
}
